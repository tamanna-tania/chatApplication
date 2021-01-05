/// <reference path="jquery-3.2.1.min.js" />
var socket = io();
socket.on('addimage', function(data, image){
	$('#conversation')
	.append(
		$('<p class="fileElement">').append($('<b>').text(data + ': '), '<a class="chatLink" target="_blank" href="'+ image +'">'+'<img class="send-img" src="'+image+'"/></a>'
		)
	);
});
socket.on('otherformat', function(data, base64file){
	$('#conversation')
	.append(
		$('<p class="fileElement">').append($('<b>').text(data + ': '), '<a target="_blank" href="'+ base64file +'">Attachment File</a>'
		)
	);
});

$(document).ready(function () {
	socket = io.connect('http://localhost:3000');
	socket.on('connect', addUser);
	socket.on('updatechat', processMessage);
	socket.on('updateusers', updateUserList);

	$('#datasend').on('click',sendMessage);
	$('#data').keypress(processEnterPress);
	$('#imagefile').on('change', function(e){
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.onload = function(evt){
			socket.emit('user image', evt.target.result);
		};
		reader.readAsDataURL(file);
		$('#imagefile').val('');
	});

	$('#otherfile').on('change', function(e){
		var file = e.originalEvent.target.files[0];
		var reader = new FileReader();
		reader.onload = function(evt){
			socket.emit('other file', evt.target.result);
		};
		reader.readAsDataURL(file);
		$('#otherfile').val('');
	});

});

function addUser() {
	socket.emit('adduser', prompt("What's your name?"));
}



function processMessage(username, data) {
	$('#conversation')
	.append(
		$('<p>').append($('<b>').text(username +': '), '<span>'+data+'</span>'
		)
	);
}

function updateUserList(data) {
	$('#users').empty();
	$.each(data, function (key, value) {
		$('#users').append('<div class="userActive">' + key + '</div>');
	});
}

function sendMessage() {
	var message = $('#data').val();
	$('#data').val('');
	socket.emit('sendchat', message);
	$('#data').focus();
}

function processEnterPress(e) {
	if (e.which == 13) {
		e.preventDefault();
		$(this).blur();
		$('#datasend').focus().click();
	}
}

