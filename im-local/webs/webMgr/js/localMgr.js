document.write('<script  type="text/javascript" src="js/lib/mem.js"></script>')  
document.write('<script  type="text/javascript" src="js/lib/pako.min.js"></script>')   
document.write('<script  type="text/javascript" src="js/lib/util.js"></script>')   
document.write('<script  type="text/javascript" src="js/lib/base64.js"></script>')   
document.write('<script  type="text/javascript" src="js/layout_one.js"></script>')      
document.write('<script  type="text/javascript" src="js/bodys_left.js"></script>')  
document.write('<script  type="text/javascript" src="js/bodys_right.js"></script>')  
document.write('<script  type="text/javascript" src="js/bodys_rightAct.js"></script>')  
document.write('<script  type="text/javascript" src="js/bodys_right_dlg.js"></script>')  
document.write('<script  type="text/javascript" src="js/define.js"></script>')  
document.write('<script  type="text/javascript" src="js/webSocket_local.js"></script>')  
window.onload = main  

function main(){  
    localSocket.connect("ws://" + util.getIp()+ ":10033/v1/tzj", "admin", "password")  
    bodys.show();
}
 