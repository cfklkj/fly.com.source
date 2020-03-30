var layoutChat = layoutChat || {};
var chat = layoutChat.Method = { 
    div_chat:'chat_main',
    chat_isUp:false,
    chat_logFirst:false,
    chat_words:null,
    img_div:null,
    video_div:null,
    audio_div:null,
    showChat:function(){
        eleBody = util.getEleById(inDiv.div_right);
        util.clearElement(eleBody); 
        util.addElement(eleBody, chatHtml); 
        this.addAudio();   
        chatLeft.show(); 
        chatRight.show(); 
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

var chatHtml='<div id="chat_main"></div>'