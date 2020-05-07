
/*
req
?&debug=true&audio=false&video=true&from=test1&to=admin1&reqTalk=true
wait
?&debug=true&audio=false&video=true&from=admin1&to=test1
*/
window.onload = videoMain

function videoMain(){ 
    debug = util.getSearchString("debug", document.URL)
    if (debug == "1"){ 
        util.setConsolePrint() 
    }
    from = util.getSearchString("from", document.URL)
    console.log(document.URL)
    console.log("from", from)
    if (from) {
        ims.onp2pRecv = channelChange.recv
        ims.onlogin = logined
        ims.connect(util.getWsUrl()+ "/wss", from, "password")  
        return
    }     
}

function logined(){
    to = util.getSearchString("to", document.URL) 
    console.log("to", to)
    reqTalk = util.getSearchString("reqTalk", document.URL)
    audio = util.getSearchString("audio", document.URL)
    video = util.getSearchString("video", document.URL) 
    showTest = util.getSearchString("showTest", document.URL) 
    rotate = util.getSearchString("rotate", document.URL) 
    channelChange.createChannel()
    medias.onwriteCallback = videos.showWriteVideo
    medias.onreadCallback = videos.showReadVideo  
    medias.setAudio(audio)
    medias.setVideo(video) 
    videos.show()
    videos.rotate = rotate
    if (reqTalk){ 
        channelChange.reqAudioTalk(to)
        console.log('reqTalk.');
    } 
    if (showTest){ 
        medias.onwriteCallback = videos.testVideo
        medias.openMedia()
    }
}