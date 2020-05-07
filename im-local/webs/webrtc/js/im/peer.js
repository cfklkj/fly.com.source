
/****************************************************************************
* WebRTC peer connection and data channel
****************************************************************************/

var p2pStream = p2pStream || { 
    local:streamLocal,
    remote:streamRemote, 
    change:streamChange, 
  }
  
var p2p = p2p || {}
var p2ps = p2p.Method ={
    peerConn:null,
    dataChannel:null,
    configuration:null, 
    to:null,
    logError:function (err) {
        if (!err) return;
        if (typeof err === 'string') {
        console.warn(err);
        } else {
        console.warn(err.toString(), err);
        }
    },
    signalingMessageCallback:function (message) {
      if (message.type === 'offer') {
        console.log('Got offer. Sending answer to peer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
                                      this.logError);
        peerConn.createAnswer(this.onLocalSessionCreated, this.logError);
    
      } else if (message.type === 'answer') {
        console.log('Got answer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
        this.logError);
    
      } else if (message.type === 'candidate') {
        peerConn.addIceCandidate(new RTCIceCandidate({
          candidate: message.candidate
        }));
    
      }
    }, 
    createPeerConnectionA: function ( ) {
        var config = p2ps.configuration
        console.log('Creating Peer connection as initiator?', "A", 'config:',
                    config);
        peerConn = new RTCPeerConnection(config);
        
        peerConn.addEventListener('icecandidate', handleConnection);
        peerConn.addEventListener(
            'iceconnectionstatechange', handleConnectionChange);
        // send any ice candidates to the other peer
        peerConn.onicecandidate = function(event) {
            console.log('icecandidate event:', event);
            if (event.candidate) {
                ims.tallMsg(p2ps.to,{
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
                }, imDefine.P2P);
            } else {
                console.log('End of candidates.');
            }
        };
        
        if (isInitiator) {
        console.log('Creating Data Channel');
        dataChannel = peerConn.createDataChannel('photos');
        this.onDataChannelCreated(dataChannel);
        
        console.log('Creating an offer');
        peerConn.createOffer(this.onLocalSessionCreated, this.logError);
        } else {
        peerConn.ondatachannel = function(event) {
            console.log('ondatachannel:', event.channel);
            dataChannel = event.channel;
            this.onDataChannelCreated(dataChannel);
        };
        }
    },
    createPeerConnection: function (isInitiator) {
        var config = p2ps.configuration
        console.log('Creating Peer connection as initiator?', isInitiator, 'config:',
                    config);
        peerConn = new RTCPeerConnection(config);
        
        // send any ice candidates to the other peer
        peerConn.onicecandidate = function(event) {
        console.log('icecandidate event:', event);
        if (event.candidate) {
            ims.tallMsg(p2ps.to,{
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
            }, imDefine.P2P);
        } else {
            console.log('End of candidates.');
        }
        };
        
        if (isInitiator) {
        console.log('Creating Data Channel');
        dataChannel = peerConn.createDataChannel('photos');
        this.onDataChannelCreated(dataChannel);
        
        console.log('Creating an offer');
        peerConn.createOffer(this.onLocalSessionCreated, this.logError);
        } else {
        peerConn.ondatachannel = function(event) {
            console.log('ondatachannel:', event.channel);
            dataChannel = event.channel;
            this.onDataChannelCreated(dataChannel);
        };
        }
    },
    onLocalSessionCreated:function (desc) {
        console.log('local session created:', desc);
        peerConn.setLocalDescription(desc, function() {
          console.log('sending local desc:', peerConn.localDescription);
          ims.tallMsg(p2ps.to, peerConn.localDescription, imDefine.P2P);
        }, this.logError);
    },
    onDataChannelCreated:function (channel) {
      console.log('onDataChannelCreated:', channel);
    
      channel.onopen = function() {
        console.log('CHANNEL opened!!!');
        sendBtn.disabled = false;
        snapAndSendBtn.disabled = false;
      };
    
      channel.onclose = function () {
        console.log('Channel closed.');
        sendBtn.disabled = true;
        snapAndSendBtn.disabled = true;
      }
    
      channel.onmessage = (adapter.browserDetails.browser === 'firefox') ?
      receiveDataFirefoxFactory() : receiveDataChromeFactory();
    }

} 





function receiveDataChromeFactory() {
  var buf, count;

  return function onmessage(event) {
    if (typeof event.data === 'string') {
      buf = window.buf = new Uint8ClampedArray(parseInt(event.data));
      count = 0;
      console.log('Expecting a total of ' + buf.byteLength + ' bytes');
      return;
    }

    var data = new Uint8ClampedArray(event.data);
    buf.set(data, count);

    count += data.byteLength;
    console.log('count: ' + count);

    if (count === buf.byteLength) {
// we're done: all data chunks have been received
console.log('Done. Rendering photo.');
renderPhoto(buf);
}
};
}

function receiveDataFirefoxFactory() {
  var count, total, parts;

  return function onmessage(event) {
    if (typeof event.data === 'string') {
      total = parseInt(event.data);
      parts = [];
      count = 0;
      console.log('Expecting a total of ' + total + ' bytes');
      return;
    }

    parts.push(event.data);
    count += event.data.size;
    console.log('Got ' + event.data.size + ' byte(s), ' + (total - count) +
                ' to go.');

    if (count === total) {
      console.log('Assembling payload');
      var buf = new Uint8ClampedArray(total);
      var compose = function(i, pos) {
        var reader = new FileReader();
        reader.onload = function() {
          buf.set(new Uint8ClampedArray(this.result), pos);
          if (i + 1 === parts.length) {
            console.log('Done. Rendering photo.');
            renderPhoto(buf);
          } else {
            compose(i + 1, pos + this.result.byteLength);
          }
        };
        reader.readAsArrayBuffer(parts[i]);
      };
      compose(0, 0);
    }
  };
}
