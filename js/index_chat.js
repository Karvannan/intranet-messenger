// window.onload=loadUsers;
var udpServer;
$(document).ready(function() {

	chrome.storage.local.get('myName',function (obj){
		$('#textMyName').val(obj['myName']);
		console.log(obj);
	});



	udpServer = new UdpServer();
  console.log("Server object created");
	var myVar=setInterval(function () {loadUsers()}, 1000);

	/*chrome.storage.local.get(null,function (obj){
		$('#textMyName').val(JSON.stringify(obj).myName);
     console.log(JSON.stringify(obj));
	});*/



	$('#textMyName').click(function() {
		if ($('#textMyName').val() == 'Identify Yourself') {
			$('#textMyName').val('');
		}
	});

	$('#textMyName').focusout(function() {
		if ($('#textMyName').val() == 'Identify Yourself') {

		} else {
			var myName= 'myName';

			var nameObj= {};

			nameObj[myName] = $('#textMyName').val();

			chrome.storage.local.set(nameObj, function() {
		          // Notify that we saved.
					console.log('Saving user name as ' + $('#textMyName').val());
		  });
		}
	});

});

	function loadUsers() {

		var users = udpServer.availableHosts();

		// var textMyName = $('#textMyName').html();
		$('#indexNav').html('');
		var indexNav = $('#indexNav');

		/*indexNav.append(textMyName + '<br/>');

		console.log(indexNav.html());*/



		for (var user in users) {

			var linkStart = '<text id="'+ user +'">';
			var linkEnd = '</text><br/>';
			indexNav.append(linkStart+user+linkEnd);
		}
		$('text').click(function() {
			loadChat(this);
		});

		/*var users = ["Sairam","Parani","Karvannan"];

		var indexNav = $('#indexNav');

		for (var i=0;i<users.length;i++) {
			var linkStart = '<text id="'+ users[i] +'">';
			var linkEnd = '</text><br/>';
			indexNav.append(linkStart+users[i]+linkEnd);
			$('#' + users[i]).click(function() {
				loadChat(this);
			});
		}*/


	}

	function loadChat(user123) {

		$('#indexSection').html('<iframe src="loadChat.html?variable1=' + $(user123).attr("id") +'" id="myFrame"></iframe>');
	}
