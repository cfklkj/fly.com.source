//http://www.wware.org/wide/yw/backups/turnserverconfig.html
function checkTURNServer(turnConfig, timeout){ 

    return new Promise(function(resolve, reject){
  
      setTimeout(function(){
          if(promiseResolved) return;
          resolve(false);
          promiseResolved = true;
          console.log('false');
      }, timeout || 5000);
  
      var promiseResolved = false
        , myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection   //compatibility for firefox and chrome
        , pc = new myPeerConnection({iceServers:[turnConfig, {"url": "stun:stun.l.google.com:19302"}]})
        , noop = function(){};
      pc.createDataChannel("");    //create a bogus data channel
      pc.createOffer(function(sdp){
        if(sdp.sdp.indexOf('typ relay') > -1){ // sometimes sdp contains the ice candidates...
          promiseResolved = true;
          resolve(true);
          console.log('true');
        }
        pc.setLocalDescription(sdp, noop, noop);
      }, noop);    // create offer and set local description
      pc.onicecandidate = function(ice){  //listen for candidate events
        if(promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay')>-1))  return;
        promiseResolved = true;
        resolve(true);
        console.log('ture');
      };
    });   
  }
  function checkTurn(){
        checkTURNServer({
            url: 'turn:im.guiruntang.club', 
            username: 'flys',
            credential: '123456'
            //"url":"stun:stun.l.google.com:19302"
        }, 2000).then(function(bool){
            console.log('is TURN server active? ', bool? 'yes':'no');
        }).catch(console.error.bind(console));
  }