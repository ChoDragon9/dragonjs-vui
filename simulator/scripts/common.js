"use strict";
/* globals document */
function getElemid(id){
	return document.getElementById(id);
}

function removeClassOfPeachFace(className){
	var elem = getElemid("peach-face");
	var peachFaceClass = elem.className;

	elem.className = peachFaceClass.replace(className, '');
}

function addClassOfPeachFace(className){
	getElemid("peach-face").className += " " + className;
}

function addTextInChat(txt, isUser, isInfo){
	var clsName = 'chatting-contents-';
	var liTag = document.createElement('li');
	var pTag = document.createElement('p');
	var ulTag = getElemid("chatting-contents");

	clsName += isUser ? 'right' : isInfo ? 'info' : 'left';
	liTag.className = clsName;
	pTag.textContent = txt;

	liTag.appendChild(pTag);
	ulTag.appendChild(liTag);
}

function addErrorTextInChat(txt){
	var clsName = 'chatting-contents-error';
	var liTag = document.createElement('li');
	var pTag = document.createElement('p');
	var ulTag = getElemid("chatting-contents");

	liTag.className = clsName;
	pTag.innerHTML = txt;

	liTag.appendChild(pTag);
	ulTag.appendChild(liTag);
}

function addInputTextInChat(postFix){
	var inputForm = getElemid("chatting-form-input");
	var txt = inputForm.value;

	if(inputForm.value !== ''){
		addTextInChat('"' + inputForm.value + '" ' + postFix, true);
	}else{
		txt = false;
	}

	inputForm.value = '';

	return txt;
}