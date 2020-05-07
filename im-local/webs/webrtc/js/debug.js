var debug = debug || {};
var debugs = debug.Method = {  
    init:function(){
        debug = util.getSearchString("debug", document.URL)
        if (debug == "1"){ 
            setConsolePrint("debug") 
        }
      //  checkTurn()
       // return
        console.log(util.getWsUrl())
        //this.check() 
        from = util.getSearchString("name", document.URL)
        to = util.getSearchString("to", document.URL) 
        p2ps.to = to 
        console.log(document.URL,from, to)
        ims.connect(util.getWsUrl()+ "/wss", from, "password") 
       //ims.connect("wss://im.guiruntang.club:2008/wss", from, "password") 
        takePhotos.init() 
      // p2pStream.change.createPeerConnections()
    //    p2pStream.remote.listenStream() 
    //channelDataRead.create(streamChange.configuration)
    channelStreamRead.create(streamChange.configuration)
        if (from.indexOf("admin") > -1)
        { 
            medias.grabWebCamVideo()  
        }else{ 
        }
    },
    check:function(){
        channels.connect()
        //devices.init() 
    },
    onError:function(code){
        console.log(code)
    }
}