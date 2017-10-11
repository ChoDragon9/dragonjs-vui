"use strict";
/* globals window, PubSubManager, SpeechSynthesisUtterance, console, setInterval, clearInterval */
/**
 * 텍스트 음성 변환 기능을 제공하는 객체이다.
 * 이벤트 구현을 위해 PubSubManager를 참조한다.
 * 
 * @class
 * @example
<caption>HTML</caption>
<script src="./vui/modules/pub-sub-manager.js"></script>
<script src="./vui/modules/speech-manager.js"></script>
 * @example
<caption>Javascript</caption>
var speechManager = new SpeechManager();
 */
class SpeechManager {
	constructor(){
		this.MAX_TEXT_LENGTH = 32767;

		this.PITCH = 1;
		this.RATE = 1;
		this.synth = window.speechSynthesis;

        this.pubSubManager = new PubSubManager();

		window.addEventListener('beforeunload', this.synth.cancel);
	}

	/**
	 * 텍스트 음성 변환을 해주는 함수이다.
	 * 
	 * @param {String} txt 음성으로 변환할 텍스트
	 * @param {String} lang BCP 47 규격에 따른 언어 코드
	 * @param {SpeechManager~exceptionCallback} exceptionCallback 예외 발생시 실행될 콜백함수
	 * @example
speechManager.speech("말하기");
//or
speechManager.speech("Speaking English", "en-US");
//or
speechManager.speech("예외 함수", "ko-KR", function(event){
	console.error(event.error);
});
	 */
	speech(txt, lang='ko-KR',exceptionCallback=()=>{}){
        if(txt.length > this.MAX_TEXT_LENGTH){
            throw(`Text to speech have to shorter then ${this.MAX_TEXT_LENGTH}.`);
        }

		var utterance = new SpeechSynthesisUtterance(txt);
		var self = this;
		var timer = null;
		var voices = this.synth.getVoices();

		for(var i = 0, ii = voices.length; i < ii; i++){
			if(voices[i].lang === lang){
				utterance.voice = voices[i];
				break;
			}
		}

		utterance.pitch = this.PITCH;
		utterance.rate = this.RATE;

		utterance.onstart = (event) => {
			console.info("speech is started.");
			if(timer === null){
				timer = setInterval(() => {
					self.synth.pause();
					self.synth.resume();
				}, 1000);	
			}

        	this.pubSubManager.publish("start", event);
		};

		utterance.onend = (event) => {
			console.info("speech is ended.");
			clearInterval(timer);
        	this.pubSubManager.publish("end", event);
		};

		utterance.onresume = (event) => {
			console.info("speech is resumed.");
			clearInterval(timer);
        	this.pubSubManager.publish("resume", event);
		};

		utterance.onerror = (event) => {
			console.error("speech is error.");
			clearInterval(timer);
			exceptionCallback(event);
        	this.pubSubManager.publish("error", event);
		};

		utterance.onpause = (event) => {
			console.info("speech is paused.");
			clearInterval(timer);
        	this.pubSubManager.publish("pause", event);
		};

		self.synth.speak(utterance);
	}

	/**
	 * 텍스트 음성 변환을 종료하는 함수이다.
	 * 
	 * @example
speechManager.cancel();
	 */
	cancel(){
		this.synth.cancel();
	}

	/**
	 * 텍스트 음성 변환 시 발생하는 이벤트를 받는 함수 이다.
	 *
	 * @param {String} eventName 이벤트 이름(start, end, resume, error, pause)
	 * @param {SpeechManager~callback} callback 콜백함수
	 * @example
speechManager.on("end", (event)=>{
	console.error(event.error);
});

speechManager.on("start", (event)=>{
	console.info("speech is started.");
});

speechManager.on("end", (event)=>{
	console.info("speech is ended.");
});

speechManager.on("resume", (event)=>{
	console.info("speech is resumed.");
});

speechManager.on("pause", (event)=>{
	console.info("speech is paused.");
});
	 */
	on(eventName, callback){
        this.pubSubManager.subscribe(eventName, callback);
    }

	/**
	 * 이벤트 발생시 실행되는 콜백함수
	 *
	 * @callback SpeechManager~callback
	 * @param {Object} event 이벤트 객체
	 * @param {String} eventName 발생한 이벤트 이름
	 */

	/**
	 * 예외 발생시 실행될 콜백함수
	 *
	 * @callback SpeechManager~exceptionCallback
	 * @param {Object} event 이벤트 객체
	 */
}