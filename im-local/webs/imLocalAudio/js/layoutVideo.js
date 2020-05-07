/*
show video
step:
1.show 
*/
var videos = {
    div_bodys:"bodys",
    div_main:"videos",
    main:null,
    write:null,
    read:null,
    rotate:null,
    rightPosition:null,
    show:function(){
        if (this.main != null) {
            this.main.setAttribute("style","")
        }else{  
            div = document.createElement("div") 
            div.setAttribute("class", this.div_main) 
            div.id = this.div_main
            ele = document.getElementById(this.div_bodys)
            ele.appendChild(div) 
            this.main = div   
        }
    },
    hide:function(){
        this.main.setAttribute("style","display:none;")
    }, 
    testVideo:function(mediaStream){
        videos.showWriteVideo(mediaStream)
        videos.showReadVideo(mediaStream)
    },
    changeShow:function(){
        if (videos.write.getAttribute("index") == "1") {
            videos.write.setAttribute("index", "2")
            videos.read.setAttribute("index", "1")
            videos.write.pause();
            // videos.write.setAttribute("style", videos.rightPosition)
            // videos.read.setAttribute("style", "")
            // videos.read.play(); 
        }else{
            videos.write.setAttribute("index", "1")
            videos.read.setAttribute("index", "2")
            videos.read.pause();
            // videos.write.setAttribute("style", "")
            // videos.read.setAttribute("style", videos.rightPosition)
            // videos.write.play(); 
        }
    },
    showWriteVideo:function(mediaStream){
        if (videos.write == null){  
            var body = document.getElementById("videos") 
            var ele = document.createElement('video')   
            ele.muted = true 
            ele.setAttribute("index", "2")
            ele.setAttribute("controls", "")
            ele.setAttribute("ondbclick", "videos.changeShow()")
            body.appendChild(ele) 
            ele.srcObject = mediaStream;  
            ele.onloadedmetadata = function() { 
                // value = (window.screen.width - ele.clientWidth)/2
                // videos.rightPosition = "right:" + value.toString() + "px"
                // console.log(videos.rightPosition )
                ele.pause(); 
                channelStreamWrite.send(mediaStream, medias.isVideo, medias.isAudio)   //send channel stream
            };   
            videos.write = ele
        }else{
            videos.write.srcObject = mediaStream
        }
    },
    showReadVideo:function(mediaStream){ 
        if (videos.read == null){  
            var body = document.getElementById("videos") 
            var ele = document.createElement('video')   
            ele.muted = true
            ele.setAttribute("index", "1")
            ele.setAttribute("controls", "")
            ele.setAttribute("ondbclick", "videos.changeShow()")
            if (videos.rotate){
                ele.setAttribute("class", videos.rotate)
            }
            body.appendChild(ele) 
            ele.srcObject = mediaStream;  
            ele.onloadedmetadata = function() {
                // ele.setAttribute("style", videos.rightPosition)
                // console.log(ele.clientLeft)
                ele.play(); 
            };   
            videos.read = ele
        }else{
            videos.read.srcObject = mediaStream
        }
    }
}