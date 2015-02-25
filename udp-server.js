/*
Copyright 2012 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Renato Mangini (mangini@chromium.org)
*/

var availableHosts = {};

var clearAvailableHosts=setInterval(function () {availableHosts = {};}, 50000);

(function(exports) {

  // Define some local variables here.
  var udpSocket = chrome.sockets.udp;
  var socketId;
  /**
  * Creates an instance of the client
  *
  */
  function UdpServer() {
    console.log('Starting UDP Server');

    // Handle the "onReceive" event.
    var onReceive = function(info) {
      if (info.socketId !== socketId)
      return;
      // availableHosts[info.remoteAddress] = info.remoteAddress;
      /*console.log('availableHosts ---->');
      console.log(availableHosts);*/

      var dataReceived = String.fromCharCode.apply(null, new Uint16Array(info.data));

      console.log("message from " + info.remoteAddress + " message : "
                  + dataReceived);

      var splitByColon = dataReceived.split(";");

      var userName = splitByColon[0].split("-")[1];
      var userIP = splitByColon[1].split("-")[1];
      availableHosts[userName] = userName;
      console.log('userName ' + userName);
      console.log('userIP ' + userIP);
      //console.log("do Read" + info.data.toString());
    };



    // Create the Socket
    udpSocket.create({}, function(socketInfo) {
      socketId = socketInfo.socketId;
      // Setup event handler and bind socket.
      udpSocket.onReceive.addListener(onReceive);
      udpSocket.bind(socketId,
        "0.0.0.0", 8888, function(result) {
          if (result < 0) {
            console.log("Error binding socket.");
            return;
          }
        });

        // TODO for closing
        var cleanup_timer;
        cleanup_timer = setInterval(function(){
          if (chrome.app.window.closed) {
            console.log("going to close");
            udpSocket.close(socketId);
            clearInterval(cleanup_timer);
          }
        },
        5000
      );

    });


  }


  UdpServer.prototype.availableHosts = function() {
    return availableHosts;
  }

  UdpServer.prototype.close = function() {
    return udpSocket.close(socketId);
  }


  exports.UdpServer = UdpServer;


})(window);
