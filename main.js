/**
* Listens for the app launching then creates the window
*
* @see http://developer.chrome.com/apps/app.runtime.html
* @see http://developer.chrome.com/apps/app.window.html
*/

var udpServer;
var myIPAddress;
var myName;

chrome.system.network.getNetworkInterfaces(function(interfaces){
    myIPAddress = interfaces[1].address;
    console.log("My IP Address " + interfaces[1].address);
});

chrome.app.runtime.onLaunched.addListener(function() {
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 300;
  var height = 600;

  chrome.app.window.create('index.html', {
    id: "helloWorldID",
  });
  // Start the required servers
  // tcpServer = new TcpServer();

  function getMyName() {
    chrome.storage.local.get('myName',function (obj){
      myName = obj['myName'];
    });
    return myName;
  }

  function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  var cleanup_timer;
  cleanup_timer = setInterval(function(){
    chrome.socket.create('udp', {},
        function(socketInfo) {
          // The socket is created, now we want to connect to the service
          var socketId = socketInfo.socketId;
          chrome.socket.connect(socketId, "255.255.255.255", 8888, function(result) {
            // We are now connected to the socket so send it some data
            var dataToBroadCast = "myName-" + getMyName() + ";myIP-" + myIPAddress + ";myTime - " + new Date() + ";";

            console.log('dataToBroadCast ' + dataToBroadCast);

            chrome.socket.write(socketId, str2ab(dataToBroadCast),
            function(sendInfo) {
              console.log("wrote " + sendInfo.bytesWritten);
            }
          );
        });
      }
    );

    /*chrome.sockets.tcp.create({},
        function (createInfo) {
            console.log(createInfo.socketId);
            chrome.sockets.tcp.connect(createInfo.socketId,
                "localhost", 2000,
                function (result) {
                    if (chrome.runtime.lastError)
                        console.log(chrome.runtime.lastError.message);
                    else {
                        console.log(result);
                        chrome.sockets.tcp.send(createInfo.socketId,
                            str2ab(req),
                              function (sendInfo) {
                                  console.log(sendInfo);
                              }
                        );
                    }
                }
            );
        }
    );*/
  },5000);

});
