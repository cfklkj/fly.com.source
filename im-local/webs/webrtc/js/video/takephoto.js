'use strict';

var takePhoto = takePhoto || {};
var takePhotos = takePhoto.Method = {
    photo:null, 
    msgPhoto:null, 
    showRemote:function(mediaStream){  
        medias.video.srcObject = mediaStream
        console.log('showRemote.');
        return
        var body = util.getEleById("bodys") 
        var ele = util.addEle('video') 
        ele.setAttribute("controls", "")
        body.appendChild(ele) 
        ele.srcObject = mediaStream; 
        ele.muted = true
        ele.play();
        console.log('showRemote.');
    },
    init:function(){ 
        var body = util.getEleById("bodys")
        body.innerHTML = ""
        var ele = util.addEle('video')
        ele.setAttribute("controls", "")
        ele.setAttribute("ontimeupdate", "takePhotos.timeupdate()")
        body.appendChild(ele) 
        medias.video = ele
        ele = util.addEle('canvas')
        body.appendChild(ele) 
        takePhotos.photo = ele
        ele = util.addEle('canvas')
        body.appendChild(ele) 
        takePhotos.msgPhoto = ele
        ele = util.addEle('button')
        ele.setAttribute("type", "button")
        ele.innerHTML="snap"
        ele.addEventListener('click', takePhotos.snapPhoto);
        body.appendChild(ele)  
        ele = util.addEle('button')
        ele.setAttribute("type", "button")
        ele.innerHTML="create"
        ele.addEventListener('click', takePhotos.create);
        body.appendChild(ele)  
    },
    timeupdate:function(){
        //https://blog.csdn.net/weixin_42307129/article/details/93594606
        // if (!medias.video.paused) { 
        //     p2pStream.local.offerStream(medias.video.srcObject) 
        // }else{
        //     p2pStream.local.closeStream()
        // }
    },
    create:function(){
         
     //  channelDataWrite.create(streamChange.configuration)
       channelStreamWrite.create(streamChange.configuration)
    },
    snapPhoto:function(){ 
       // channelDataWrite.send("hello")
       if (medias.video.paused) { 
         medias.video.play()
         channelStreamWrite.send(medias.video.srcObject)
       }else{
        medias.video.pause()
       }
        // var photoContext = takePhotos.photo.getContext('2d'); 
        // takePhotos.photo.width = medias.video.videoWidth
        // takePhotos.photo.height = medias.video.videoHeight
        // photoContext.drawImage(medias.video, 0, 0, medias.video.videoWidth, medias.video.videoHeight);
        // takePhotos.sendPhoto()
    }, 
    renderPhoto:function (data) {
        var canvas = takePhotos.msgPhoto
        canvas.width = photoContextW;
        canvas.height = photoContextH;
        canvas.classList.add('incomingPhoto');
        // trail is the element holding the incoming images
        trail.insertBefore(canvas, trail.firstChild);
    
        var context = canvas.getContext('2d');
        var img = context.createImageData(photoContextW, photoContextH);
        img.data.set(data);
        context.putImageData(img, 0, 0);
    },    
    sendPhoto:function(){ 
        // Split data channel message in chunks of this byte length.
        var CHUNK_LEN = 4096;
        var photoContext = takePhotos.photo.getContext('2d'); 
        var photoContextW = takePhotos.photo.width
        var photoContextH = takePhotos.photo.height
        console.log('width and height ', photoContextW, photoContextH, len);
        var img = photoContext.getImageData(0, 0, photoContextW, photoContextH),
        len = img.data.byteLength,
        n = len / CHUNK_LEN | 0;

        console.log('Sending a total of ' + len + ' byte(s)');
 
        ims.tallMsg("admin", len,imDefine.chat_bytesStart)  
        // split the photo and send in chunks of about 64KB
        for (var i = 0; i < n; i++) {
        var start = i * CHUNK_LEN,
        end = (i + 1) * CHUNK_LEN;
       // console.log(start + ' - ' + (end - 1));
        ims.byteMsg("admin", img.data.subarray(start, end), imDefine.chat_bytes);
        
        }

        // send the reminder, if any
        if (len % CHUNK_LEN) {
        // console.log('last ' + len % CHUNK_LEN + ' byte(s)'); 
         ims.byteMsg("admin", img.data.subarray(n * CHUNK_LEN), imDefine.chat_bytes);
        }
        ims.tallMsg("admin", len,imDefine.chat_bytesEnd) 
    }
}
 