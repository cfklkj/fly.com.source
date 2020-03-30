 
var layoutMain = layoutMain || {};
var mainLayout = layoutMain.Method = { 
    div_bodys:"bodys",
    div_main:"main",
    // releaseScroll:function(){
    //     document.getEleById(this.div_main).addEventListener('touchmove', function (e) {
    //         e.stopPropagation();
    //     }, {passive: false});  
    // },
    show:function(){
        // div = util.addEle("div")
        // div.setAttribute("class", 'main') 
        // div.id = this.div_main
        // ele = util.getEleById(this.div_bodys)
        // ele.appendChild(div)  
        this.addAudio()
        chatsLayout.show()
    }, 
    showImg:function(evt){ 
        div = util.addEle("div")
        util.addClass(div,'jump')

        span = '<span index="1"><img onclick="chat.hideImg()" ></img></span>' 
        div.innerHTML = span

        span = '<span index="2"><a href="' + evt.src + '" download="' + evt.name + '"><img src="' + evt.src + '"></img></a></span>' 
        div.innerHTML += span 
        eleBody = util.getEleById("bodys");  
        eleBody.appendChild(div)
        chat.img_div = div
    },  
    hideImg:function(){
        eleBody = util.getEleById("bodys");
        eleBody.removeChild(chat.img_div) 
    },
    addVideo:function(){ //视频
        embed = util.addEle("embed")
        embed.src=  "http://" +  util.getUrl() + "/download/sys/tips.mp3"
        embed.hidden=true 
        embed.autos
        eleBody = util.getEleById("bodys");  
        eleBody.appendChild(embed)
        this.video_div = embed 
    },
    addAudio:function(){    //音频    --苹果 自带浏览器不能自动播放
        audio = util.addEle("audio")
        audio.src= "http://" + util.getUrl() + "/download/sys/tips.mp3" 
        eleBody = util.getEleById("bodys"); 
        eleBody.appendChild(audio)
        this.audio_div = audio  
    },
    playAudio:function(){
       this.audio_div.play()
    },
    playVideo:function(){
        this.video_div.start()
    }
}