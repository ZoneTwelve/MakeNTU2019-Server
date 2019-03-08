var express = require('express');
var router = express.Router();

const random = require('../modules/random'); //生成random access token
const searchRange = 0.01;

var accessDevice = []; // 停車場基準位置
var memory = new Object(); //停車場具體停車位資訊

// router.get("/", (req, res)=>res.send('test'));

router.get("/status", function (req, res){ //回傳附近停車場狀態
  let pos = [Number(req.query.lat), Number(req.query.lon)]; // 緯度:~~25, 經度:~~121
  let devices = accessDevice.filter(device=>{
    //console.log(device.position, pos);
    if((device.position[0]-searchRange<=pos[0]&&pos[0]<=device.position[0]+searchRange)&&
        device.position[1]-searchRange<=pos[1]&&pos[1]<=device.position[1]+searchRange){
      return true;
    }
  });
  let result = devices.map(d=>{
    return {
      id:d.id,
      name:d.name,
      position:d.position,
      space:memory[d.id].space,
    }
  });
  res.send(result);
});

// let request("/api/registered?lat=25.0131203&lon=121.5368873&name=virtualDevice")
router.get('/registered', (req, res)=>{//停車場系統裝置註冊
  let token = random();
  let position = [Number(req.query.lat), Number(req.query.lon)];
  if(!position[0]||!position[1])
    return res.status(400).send({ error:"missing position" });
  // let {uuid} = req.query;
  //if(search(uuid)===haveAccess){ do the thing... }
  let device = {
    name:(req.query.name||"unknow"),
    id:accessDevice.length,
    token:token,
    update:new Date(),
    position:position,
    length:token.length,
  };
  accessDevice.push(device);
  memory[device.id] = {
    id:device.id,
    status:(req.query.status==true),
    space:[],
  };
  res.send(device);
});

router.post('/update', (req, res) => {  //更新停車場位置
  let {token} = req.body; // 裝置 access token
  let device = accessDevice.find(d=>d.token===token)||null; // 利用 access token 找到隸屬單位的裝置
  let io = req.app.get('socketio');
  if(device!==null){
    //偷懶直接把 space encode
    let data = {
      id:device.id,
      status:(req.query.status==true),
      space:JSON.parse(req.body.space),
    };
    memory[parseInt(device.id)] = data;
    // socket.emit('status', JSON.stringify(data));
    io.emit('status', {
      id:device.id,
      // position:device.position,
      time:Number(new Date()),
      status:data.status,
      space:data.space,
    });
    res.status(200).send('');
    // console.log(req.app.get('socketio'));
    //socket update data to client
  }else{
    return res.status(401).send({error:"401 Unauthorized, no access to update status"});
  }
  // res.status(501).send({ error: "it is not finished yet" })
});

//debug用
router.get('/remove', (req, res)=>{
  let {index} = req.query
  var status = false;
  if(index>-1&&index<accessDevice.length&&accessDevice[index]!=undefined){
    let d = accessDevice.splice(index, 1)[0];
    //console.log(d, memory[d.id]);
    delete memory[d.id];
    status = true;
  }
  res.send(status?"remove successful":"remove fail");
});

module.exports = router;
