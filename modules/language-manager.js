"use strict";
/* globals window */
/**
 * 브라우저에서 지원하는 언어를 리턴한다.
 * 
 * @class
 * @example
 	var languageManager = new LanguageManager();
 */
class LanguageManager {
	constructor(){
		this.synth = window.speechSynthesis;
	}

	getVoices(callback){
		var voices = this.synth.getVoices();
		callback(voices);
	}

	/**
	 * 브라우저에서 지원하는 언어를 가져온다.
	 *
	 * @param {LanguageManager~callback} callback 지원하는 언어를 받을 수 있는 함수
	 * @example
languageManager.getValidLanguage((voice) => {
  for(var i = 0, ii = voices.length; i < ii; i++){
    console.log(voices);
  }
});
	 */
	getValidLanguage(callback){
		this.getVoices(callback);

		this.synth.onvoiceschanged = (event) => {
			this.getVoices(callback);
		};
	}

	/**
	 * 지원하는 언어를 받을 수 있는 함수
	 *
	 * @callback LanguageManager~callback
	 * @param {SpeechSynthesisVoice} voices Web Speech API 중 SpeechSynthesisVoice를 전달한다.
	 */
}