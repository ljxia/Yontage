// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function getUID(length){
  length = length || 20;
  var s = "";
  for (var i = length; i >= 0; i--){s += getRandomChar();};
  return s;
}

function getTimestamp(){
  return new Date().getTime();
}

function getRandomNumber(range){
  range = range || 10;
	return Math.floor(Math.random() * range);
}

function getRandomChar(){
	var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
	return chars.substr( getRandomNumber(62), 1 );
}

