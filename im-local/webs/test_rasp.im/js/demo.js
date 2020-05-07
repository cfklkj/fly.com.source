document.write('<script  type="text/javascript" src="js/lib/util.js"></script>')   
document.write('<script  type="text/javascript" src="js/webSocket_local.js"></script>')   
document.write('<script  type="text/javascript" src="js/define.js"></script>')   
document.write('<script  type="text/javascript" src="js/bodys.js"></script>')   
document.write('<script  type="text/javascript" src="js/mkMsg.js"></script>')   
document.write('<script  type="text/javascript" src="js/bodysLeft.js"></script>')   
document.write('<script  type="text/javascript" src="js/bodysMiddel.js"></script>')   
document.write('<script  type="text/javascript" src="js/bodysRight.js"></script>')       
document.write('<script  type="text/javascript" src="js/mkMsg_rasp.js"></script>')     
document.write('<script  type="text/javascript" src="js/lib/base64.js"></script>')     

window.onload = main  

function main(){
    bodys.show();
    user = util.getSearchString("user", document.URL)  
    localSocket.mkLoginStr(user,"") 
    localSocket.connect(defines.WsUrl)
}