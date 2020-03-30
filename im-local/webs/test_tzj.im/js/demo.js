document.write('<script  type="text/javascript" src="js/lib/util.js"></script>')   
document.write('<script  type="text/javascript" src="js/webSocket_local.js"></script>')   
document.write('<script  type="text/javascript" src="js/define.js"></script>')   
document.write('<script  type="text/javascript" src="js/bodys.js"></script>')   
document.write('<script  type="text/javascript" src="js/mkMsg.js"></script>')   
document.write('<script  type="text/javascript" src="js/bodysLeft.js"></script>')   
document.write('<script  type="text/javascript" src="js/bodysMiddel.js"></script>')   
document.write('<script  type="text/javascript" src="js/bodysRight.js"></script>')     
document.write('<script  type="text/javascript" src="js/mkMsg_nginx.js"></script>')     
document.write('<script  type="text/javascript" src="js/mkMsg_imV2.js"></script>')     
document.write('<script  type="text/javascript" src="js/lib/base64.js"></script>')     

window.onload = main  

function main(){
    bodys.show();
   // localSocket.connect("ws://127.0.0.1:10124/wss")
    //localSocket.connect("ws://im.guiruntang.club:10213/wss")
  // localSocket.connect("ws://192.168.152.131:9123/wss")
 //  localSocket.connect("ws://127.0.0.1:8963/wss")
 localSocket.connect(defines.WsUrl)
}