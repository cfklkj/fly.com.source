'use strict';

window.onload=main
function main(){ 
  setConsolePrint()
}
function setConsolePrint(){  
  var ele = document.querySelector("body")
  var logger = document.createElement("div") 
  ele.appendChild(logger)
  console.log = function (message) {
      if (typeof message == 'object') {
          logger.innerHTML = (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />' + logger.innerHTML;
      } else {
          logger.innerHTML = message + '<br />' + logger.innerHTML;
      }
  }
}

var isInitiator;

window.room = prompt("Enter room name:");

var socket = io.connect();

if (room !== "") {
  console.log('Message from client: Asking to join room ' + room);
  socket.emit('create or join', room);
}

socket.on('created', function(room, clientId) {
  isInitiator = true;
});

socket.on('full', function(room) {
  console.log('Message from client: Room ' + room + ' is full :^(');
});

socket.on('ipaddr', function(ipaddr) {
  console.log('Message from client: Server IP address is ' + ipaddr);
});

socket.on('joined', function(room, clientId) {
  console.log('joined' + room);
  isInitiator = false;
});

socket.on('log', function(array) {
  console.log.apply(console, array);
});
