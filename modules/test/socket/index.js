var io = require('socket.io-client');
let server = ['http://localhost:3000', 'https://makentu2019-test.herokuapp.com'][parseInt(process.argv[2])||0];
var socket = io.connect(server, {reconnect: true});

socket.on('connect', function (socket) {
  console.log(server, 'Socket client ready');
  console.log(new Date()+' connected');
});

socket.on('status', (data)=>{
  console.log('模擬使用者接收資料', new Date(data.time));
  console.log(data)
});