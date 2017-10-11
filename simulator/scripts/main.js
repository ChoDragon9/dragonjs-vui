"use strict";
/* globals getElemid, initSpeechSynthesis, initSpeechRecognition, initChatScrolling, window */

function initChatScrolling(){
	getElemid("chatting-box").onmousewheel = (event)=>{
		var parentHeight = getElemid("chatting-box").offsetHeight;
		var chatBox = getElemid("chatting-contents");
		var scrollWheelDeltaY = event.wheelDeltaY / 10;
		var bottom = parseInt(chatBox.style.bottom);
		var diff = chatBox.offsetHeight - parentHeight;

		if(isNaN(bottom)){
			bottom = 0;
		}

		if(
			(bottom === 0 && scrollWheelDeltaY > 0) ||
			(diff + 20 < (bottom + scrollWheelDeltaY) * -1) ||
			(diff < 0)
			){
			scrollWheelDeltaY = 0;	
		}

		if(bottom + scrollWheelDeltaY > 0){
			bottom = 0;
			scrollWheelDeltaY = 0;	
		}

		chatBox.style.bottom = bottom + scrollWheelDeltaY + "px";
	};
}

window.onload = () => {
	initSpeechSynthesis();
	initSpeechRecognition();
	initChatScrolling();
};