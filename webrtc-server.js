(function(exports) {

  function WebRtcServer() {
    console.log('Starting WebRTC Server');

  }

  WebRtcServer.prototype.makeOffer = function() {
    RTCPeerConnection = webkitRTCPeerConnection;

    var pcSettings = [
      {
        'optional': [{DtlsSrtpKeyAgreement: false}]
      }
    ];
    pc = new webkitRTCPeerConnection({
      iceServers: [{ url: 'stun:localhost:19302' }]
    });
    makeDataChannel();
    pc.onsignalingstatechange = onsignalingstatechange;
    pc.oniceconnectionstatechange = oniceconnectionstatechange;
    pc.onicegatheringstatechange = onicegatheringstatechange;
    pc.createOffer(function (desc) {
      pc.setLocalDescription(desc, function () {});
      // We'll pick up the offer text once trickle ICE is complete,
      // in onicecandidate.
    });
    pc.onicecandidate = function(candidate) {
      // Firing this callback with a null candidate indicates that
      // trickle ICE gathering has finished, and all the candidates
      // are now present in pc.localDescription.  Waiting until now
      // to create the answer saves us from having to send offer +
      // answer + iceCandidates separately.
      if (candidate.candidate == null) {
        console.log("Your new2 offer is:");
        console.log(JSON.stringify(pc.localDescription));
        getOffer(JSON.stringify(pc.localDescription));
      }
    }
  }

  function onsignalingstatechange(state) {
    //console.info('signaling state change:', state);
  }
  function oniceconnectionstatechange(state) {
    //console.info('ice connection state change:', state);
  }
  function onicegatheringstatechange(state) {
    //console.info('ice gathering state change:', state);
  }

  function getOffer(pastedOffer) {
    data = JSON.parse(pastedOffer);
    offer = new RTCSessionDescription(data);
    answer = null;

    pc = new webkitRTCPeerConnection({
      iceServers: [{ url: 'stun:localhost:19302' }]
    });
    pc.onsignalingstatechange = onsignalingstatechange;
    pc.oniceconnectionstatechange = oniceconnectionstatechange;
    pc.onicegatheringstatechange = onicegatheringstatechange;
    pc.onicecandidate = function(candidate) {
      // Firing this callback with a null candidate indicates that
      // trickle ICE gathering has finished, and all the candidates
      // are now present in pc.localDescription.  Waiting until now
      // to create the answer saves us from having to send offer +
      // answer + iceCandidates separately.
      if (candidate.candidate == null) {
        doShowAnswer();
      }
    }
    doHandleDataChannels();
  }

  var dataChannelSettings = {
    'reliable': {
      ordered: true,
      maxRetransmits: 0
    },
  };

  function doShowAnswer() {
    answer = pc.localDescription;
    console.log("\n\nHere is your answer:");
    console.log(JSON.stringify(answer) + "\n\n");
  }

  function doHandleDataChannels() {
    var labels = Object.keys(dataChannelSettings);
    pc.ondatachannel = function(evt) {
      var channel = evt.channel;
      var label = channel.label;
      pendingDataChannels[label] = channel;
      //channel.binaryType = 'arraybuffer';
      channel.onopen = function() {
        dataChannels[label] = channel;
        delete pendingDataChannels[label];
        if(Object.keys(dataChannels).length === labels.length) {
          console.log("\nConnected!");
          inputLoop(channel);
        }
      };
      channel.onmessage = function(evt) {
        data = JSON.parse(evt.data);
        cursor.blue();
        console.log(data.message);
        inputLoop(channel);
      };
      channel.onerror = doHandleError;
    };

    pc.setRemoteDescription(offer, doCreateAnswer, doHandleError);
  }

  function doCreateAnswer() {
    pc.createAnswer(doSetLocalDesc, doHandleError);
  }

  function doSetLocalDesc(desc) {
    answer = desc;
    pc.setLocalDescription(desc, undefined, doHandleError);
  };

  function makeDataChannel() {
    // If you don't make a datachannel *before* making your offer (such
    // that it's included in the offer), then when you try to make one
    // afterwards it just stays in "connecting" state forever.  This is
    // my least favorite thing about the datachannel API.
    var channel = pc.createDataChannel('test', {reliable:true});
    channel.onopen = function() {
      console.log("\nConnected!");
      inputLoop(channel);
    };
    channel.onmessage = function(evt) {
      data = JSON.parse(evt.data);
      cursor.blue();
      console.log(data.message);
      inputLoop(channel);
    };
    channel.onerror = doHandleError;
  }
  function doHandleError(error) {
    throw error;
  }
  exports.WebRtcServer = WebRtcServer;


})(window);
