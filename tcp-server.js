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

const DEFAULT_MAX_CONNECTIONS=5;

(function(exports) {

  function TcpServer() {
    console.log("Starting TCP Server");
    chrome.sockets.tcpServer.create({}, function(info){
      chrome.sockets.tcpServer.listen(info.socketId, '0.0.0.0', 2000, function(result){
        onListenCallback(info.socketId, result);
      });
    });

    var serverSocketId;
    function onListenCallback(socketId, resultCode) {
      if (resultCode < 0) {
        console.log("Error listening:" +
        chrome.runtime.lastError.message);
        return;
      }
      console.log("TCP Server Started on port 2000");
      serverSocketId = socketId;
      chrome.sockets.tcpServer.onAccept.addListener(onAccept)
    }
  }

  function onAccept(info) {
    if (info.socketId != serverSocketId)
    return;

    // A new TCP connection has been established.
    console.log(info);
    chrome.sockets.tcp.send(info.clientSocketId, data,
      function(resultCode) {
        console.log("Data sent to new TCP client connection.")
      });
      chrome.sockets.tcp.onReceive.addListener(onReceive);
      chrome.sockets.tcp.onReceiveError.addListener(function(info) {
        console.log("Error: ", info);
      });

      chrome.sockets.tcp.setPaused(info.clientSocketId, false);

      buf = str2ab("Connected.\n");
      chrome.sockets.tcp.send(info.clientSocketId, buf, function(info) {
        if (info.resultCode != 0)
        console.log("Send failed.");
      });


    }

    exports.TcpServer = TcpServer;


  })(window);
