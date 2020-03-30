var imLoad = imLoad || {};
var loadIm = imLoad.Method = {  
    script:null,
    writes:function(){
        // this.write('<script  type="text/javascript" src="js/lib/util.js"></script>')    
        this.writeJs("js/lib/util.js")
        this.writeJs("js/lib/mem.js")    
        this.writeJs("js/lib/pako.min.js")    
        this.writeJs("js/layoutConsole.js")    
        this.writeJs("js/layoutMain.js")    
        this.writeJs("js/layoutMenu.js")    
        this.writeJs("js/layoutTitle.js")    
        this.writeJs("js/layoutChat.js")    
        this.writeJs("js/layoutChats.js")    
        this.writeJs("js/websocket.js")    
        this.writeJs("js/routeMsg.js")    
        this.writeJs("js/define.js")    
        this.writeJs("js/clicks.js")    
        this.writeJs("js/webHttp.js")    
        this.writeJs("js/layoutLogin.js")    
        this.writeJs("js/imgDlg.js")     
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
    loadIm.writes() 
    setTimeout("init()", 1000)   //web 外部网络 时间要延长
}
function init(){
    loadIm.set() 
   // consoleLayout.show() 
    if (util.isMobile()){
        loadIm.mobile()
    }else{ 
        loadIm.desktop() 
    }  
    loginLayout.show() 
    
}