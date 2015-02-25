$(document).ready(function() {
	loadUserChat();
});
// window.onload=loadUserChat;

	function loadUserChat() {
		var parameters = location.search.substring(1).split("&");
	    var temp = parameters[0].split("=");
	    l = unescape(temp[1]);
		if (l == 'undefined' || l == 'null' || l == '' || l == "")
			$('#chatHeader').html('Chat now');
		else {
			$("#chatBody").html('<div id="chatHeader"></div><div id="chatNav"></div>');
			$('#chatHeader').html('Chat with ' + l);
			$('#chatNav').html('<textarea id="chatArea">Chat here </textarea><br/> <button type="button" name="sendButton" id="sendButton" value="Send"/><br/>');
		}

	}
