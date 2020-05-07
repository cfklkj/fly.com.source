document.write('<script  type="text/javascript" src="js/lib/debug.js"></script>')  
document.write('<script  type="text/javascript" src="js/debug.js"></script>')  
document.write('<script  type="text/javascript" src="js/device.js"></script>')  
document.write('<script  type="text/javascript" src="js/channel.js"></script>')  
document.write('<script  type="text/javascript" src="js/lib/util.js"></script>')  
document.write('<script  type="text/javascript" src="js/video/media.js"></script>') 
document.write('<script  type="text/javascript" src="js/video/takephoto.js"></script>')  
document.write('<script  type="text/javascript" src="js/im/define.js"></script>')  
document.write('<script  type="text/javascript" src="js/im/streamLocal.js"></script>')  
document.write('<script  type="text/javascript" src="js/im/streamRemote.js"></script>')  
document.write('<script  type="text/javascript" src="js/im/streamChange.js"></script>')  
document.write('<script  type="text/javascript" src="js/im/im.js"></script>')  
document.write('<script  type="text/javascript" src="js/im/peer.js"></script>')  
document.write('<script  type="text/javascript" src="js/im/channelData.js"></script>')  
document.write('<script  type="text/javascript" src="js/im/channelStream.js"></script>')  
document.write('<script  type="text/javascript" src="js/lib/mem.js"></script>')  
document.write('<script  type="text/javascript" src="js/lib/pako.min.js"></script>')  
document.write('<script  type="text/javascript" src="js/checkTurn.js"></script>')  

var imLoad = imLoad || {};
var loadIm = imLoad.Method = {  
    script:null,
    writes:function(){
        // this.write('<script  type="text/javascript" src="js/lib/util.js"></script>')    
        // this.writeJs("js/lib/debug.js")  
        // this.writeJs("js/debug.js")  
        // this.writeJs("js/device.js")
        // this.writeJs("js/channel.js")
        // this.writeJs("js/lib/util.js")
        // this.writeJs("js/video/media.js")
        // this.writeJs("js/video/takephoto.js") 
        // this.writeJs("js/im/define.js")
        // this.writeJs("js/im/streamLocal.js")
        // this.writeJs("js/im/streamRemote.js")
        // this.writeJs("js/im/streamChange.js")
        // this.writeJs("js/im/im.js")
        // this.writeJs("js/im/peer.js")
        //  this.writeJs("js/lib/mem.js")    
        // this.writeJs("js/lib/pako.min.js")    
        // this.writeJs("js/layoutConsole.js")    
        // this.writeJs("js/layoutMain.js")    
        // this.writeJs("js/layoutMenu.js")    
        // this.writeJs("js/layoutTitle.js")    
        // this.writeJs("js/layoutChat.js")    
        // this.writeJs("js/layoutChats.js")    
        // this.writeJs("js/websocket.js")    
        // this.writeJs("js/routeMsg.js")    
        // this.writeJs("js/define.js")    
        // this.writeJs("js/clicks.js")    
        // this.writeJs("js/webHttp.js")    
        // this.writeJs("js/layoutLogin.js")    
        // this.writeJs("js/imgDlg.js")     
    },
    writeJs:function(path){  
       var scriptNode = document.createElement("script");
       scriptNode.setAttribute("type", "text/javascript");
       scriptNode.setAttribute("src", path);
       document.head.appendChild(scriptNode);
    },
    writeCss:function(path){  
       var linkNode = document.createElement("link");
       linkNode.setAttribute("type", "text/css");
       linkNode.setAttribute("rel", "stylesheet");
       linkNode.setAttribute("href", path);
       document.head.appendChild(linkNode);
    },
    desktop:function(){
        //document.head.write('<link type="text/css" rel="stylesheet" href="css/im.css" />')        
        this.writeCss("css/im.css")   
    },
    mobile:function(){
        this.writeCss("css/mobile/im.css")  
    },
    set:function(){
        //禁止移动
        var lastTouchEnd = 0
        // document.body.addEventListener('touchmove', function (e) { 
        //     e.preventDefault(); 
        // }, {passive: false}); 
        //禁止双指放大
        document.body.addEventListener('touchstart', function (e) { 
            if (e.touches.length > 1){
                e.preventDefault(); 
            }
        }, {passive: false}); 
        //禁止双击放大
        document.body.addEventListener('touchend', function (e) {
            var now = Data.now()
            if (now - lastTouchEnd <= 300){
                e.preventDefault(); 
            }
            lastTouchEnd = now
        }, {passive: false}); 
    },
    htmlData:function(){
        data = document.getElementsByTagName('html')[0].outerHTML
        document.write('<!DOCTYPE html>') 
        document.write(data)
        console.debug(data)
    }

}


window.onload = main   
function main(){
    init()
    return
    loadIm.writes() 
    setTimeout("init()", 1000)   //web 外部网络 时间要延长
}
function init(){
    loadIm.set()  
    debugs.init()
    return
   // consoleLayout.show() 
    if (util.isMobile()){
        loadIm.mobile()
    }else{ 
        loadIm.desktop() 
    }  
    loginLayout.show() 
    
}