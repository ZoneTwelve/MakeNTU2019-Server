const request = require('request');
const random = require('../../modules/random');

var server = ["http://localhost:3000", "https://makentu2019-test.herokuapp.com"][parseInt(process.argv[2])||0];
var device;
var space = [
  {
    "pid":0,
    "status":false,
    "detail":{
      "layer":"B1",
      "price":0
    }
  },{
    "pid":1,
    "status":false,
    "detail":{
      "layer":"B1",
      "price":0
    }
  },{
    "pid":2,
    "status":true,
    "detail":{
      "layer":"1",
      "price":0
    }
  }
];
function registered(){
  let value = {
    uuid:random(8),
    lat:25.0131203+(Math.random()*0.01-0.005),
    lon:121.5368873+(Math.random()*0.01-0.005),
    name:"virtualDevice",
  };
  let option = {
    url:`${server}/api/registered?uuid=${encodeURI(random(8))}&lat=${value.lat}&lon=${value.lon}&name=${value.name}`
  };
  request(option, (e,r,d)=>{
    device = JSON.parse(d);
    console.log("registered",device);
    update();
  });
}


function update(){
  let options = {
    url:server+"/api/update",
    form:{
      token:device.token,
      status:"true",
      space:JSON.stringify(space)
    }
  }

  request.post(options, (e,r,d)=>{
    console.log("update status", r.statusCode, new Date(), d);
    status();
  });
}

function status(){
  let option = {
    url:server+"/api/status?lat=25.0131203&lon=121.5368873"
  }
  request(option, (e,r,d)=>{
    let data = JSON.parse(d);
    console.log(data);
    for(var db of data)
      console.log('space:',db.space);
    //remove();
    setTimeout(()=>{
      space[0]['status'] = (Math.random()>0.5);
      space[1]['status'] = !space[0]['status'];
      space[2]['status'] = ((Number(new Date())%10000)>5000)
      update();
    }, (Math.random()*4000+1000));
  });
}

function remove(callback){
  request(server+'/api/remove?index='+device.id, (e,r,d)=>{
    return callback(d);
    //registered();
  });
}

process.on('SIGINT', function() {
  console.log('remove device...');
  remove((result)=>{
    console.log(result);
    process.exit();
  });
});

registered();
