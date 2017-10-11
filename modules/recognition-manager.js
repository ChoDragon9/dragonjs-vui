"use strict";
/* globals PubSubManager, webkitSpeechRecognition, webkitSpeechGrammarList, console, clearTimeout, setTimeout */
/**
 * 음성인식 기능을 제공하는 객체이다.
 * 이벤트 구현을 위해 PubSubManager를 참조한다.
 * 
 * @class
 * @example
<caption>HTML</caption>
<script src="./vui/modules/pub-sub-manager.js"></script>
<script src="./vui/modules/recognition-manager.js"></script>
* @example
<caption>Javascript</caption>
var recognitionManager = new RecognitionManager();
 */
class RecognitionManager {
    constructor(){
        this.MAX_TEXT_LENGTH = 30;

        this.INTERIM_RESULTS = false; //결과값을 계속 전달해줌.
        this.MAX_ALTERNATIVES = 1; //인식률이 높은 순서대로 전달
        this.CONTINUOUS = false; //결과를 하나만 전달한다.
        this.DEAFULT_LANG = 'ko-KR';
        this.AUTO_STOP_TIME = 5000;

        this.pubSubManager = new PubSubManager();

        this.recognition = new webkitSpeechRecognition();
        this.recognition.interimResults = this.INTERIM_RESULTS;
        this.recognition.maxAlternatives = this.MAX_ALTERNATIVES;
        this.recognition.continuous = this.CONTINUOUS;

        this._words = {};
        this._sentence = {};
    }

    /**
     * 인식할 단어를 등록하는 함수
     * 
     * @param {String} str 인식할 단어
     * @param {RecognitionManager~addWordCallback} callback 단어 인식시 실행할 콜백 함수
     * @returns {String} 등록한 단어의 Token
     * @example
var wordToken = recognitionManager.addWord("아쿠아", ()=>{
    console.info("'아쿠아'가 인식되었습니다.");
});
     */
    addWord(str, callback){
        if(str.length > this.MAX_TEXT_LENGTH){
            this.stop();
            throw(`word have to shorter then ${this.MAX_TEXT_LENGTH}.`);
        }
        var wordToken = this.pubSubManager.subscribe(str, callback);
        this._words[wordToken] = str;
        return wordToken;
    }

    /**
     * 단어 인식시 실행할 콜백 함수
     *
     * @callback RecognitionManager~addWordCallback
     * @param {String} result 인식한 단어
     */

    /**
     * 등록한 단어를 삭제하는 함수
     * 
     * @param {String} wordToken 등록한 단어의 Token
     * @example
recognitionManager.removeWord(wordToken);
     */
    removeWord(wordToken){
        delete this._words[wordToken];
    }

    /**
     * 등록한 모든 단어를 삭제한다.
     * 
     * @example
recognitionManager.clearWord();
     */
    clearWord(){
        var wordTokens = Object.keys(this._words);
        wordTokens.forEach((token) => {
            this.pubSubManager.unsubscribe(token);
        });
        this._words = {};
    }

    /**
     * 인식할 문장을 등록하는 함수
     * 
     * @param {String} str 인식할 문장
     * @param {RecognitionManager~addSentenceCallback} callback 문장 인식시 실행할 콜백 함수
     * @returns {String} 등록한 문장의 Token
     * @example
var sentenceToken = recognitionManager.addSentence("텍스트 인식하기", ()=>{
    console.info("'텍스트 인식하기'가 인식되었습니다.");
});
     */
    addSentence(str, callback){
        if(str.length > this.MAX_TEXT_LENGTH){
            this.stop();
            throw(`Sentence have to shorter then ${this.MAX_TEXT_LENGTH}.`);
        }

        var sentenceToken = this.pubSubManager.subscribe(str, callback);
        this._sentence[sentenceToken] = str;
        return sentenceToken;
    }

    /**
     * 문장 인식시 실행할 콜백 함수
     *
     * @callback RecognitionManager~addSentenceCallback
     * @param {String} result 인식한 문장
     */

    /**
     * 등록한 문장을 삭제하는 함수
     * 
     * @param {String} sentenceToken 등록한 문장의 Token
     * @example
recognitionManager.removeSentence(sentenceToken);
     */
    removeSentence(sentenceToken){
        delete this._sentence[sentenceToken];
    }

    /**
     * 등록한 모든 문장을 삭제한다.
     *
     * @example
recognitionManager.clearSentence();
     */
    clearSentence(){
        var sentenceTokens = Object.keys(this._sentence);
        sentenceTokens.forEach((token) => {
            this.pubSubManager.unsubscribe(token);
        });
        this._sentence = {};
    }

    /**
     * 음성인식을 활성화하는 함수
     * 
     * @param {String} lang BCP 47 규격에 따른 언어 코드
     * @example
recognitionManager.start('ko-KR'); 
     */
    start(lang){
        var self = this;
        var autoStopTimer = null;
        var naturalLanguage = Object.values(self._words).concat(Object.values(self._sentence)).join(' | ');
        var grammar = '#JSGF V1.0; grammar naturalLanguages; public <naturalLanguage> = ' + naturalLanguage + ' ;';
        var speechRecognitionList = new webkitSpeechGrammarList();

        speechRecognitionList.addFromString(grammar, 1);

        this.recognition.grammars = speechRecognitionList;
        this.recognition.lang = !!lang ? lang : this.DEAFULT_LANG;
        this.recognition.start();

        this.recognition.onresult = (event) => {
            console.info("RecognitionManager result");
            var result = event.results[0][0].transcript;
            self.pubSubManager.publish("result", result);
            self.pubSubManager.publish(result, result);
        };
        this.recognition.onstart = (event) => {
            console.info("RecognitionManager start");
            self.pubSubManager.publish("start", event);

            if(autoStopTimer !== null){
                clearTimeout(autoStopTimer);
            }

            autoStopTimer = setTimeout((self) => {
                self.pubSubManager.publish("autoend", '');
                self.stop();
            }, this.AUTO_STOP_TIME, self);
        };
        this.recognition.onend = (event) => {
            console.info("RecognitionManager end");
            clearTimeout(autoStopTimer);
            self.pubSubManager.publish("end", event);
        };
        this.recognition.onspeechend = (event) => {
            console.info("RecognitionManager speechend");
            self.pubSubManager.publish("speechend", event);
        };
        this.recognition.onspeechstart = (event) => {
            console.info("RecognitionManager speechstart");
            clearTimeout(autoStopTimer);
            self.pubSubManager.publish("speechstart", event);
        };
        this.recognition.onnomatch = (event) => {
            console.info("RecognitionManager nomatch");
            self.pubSubManager.publish("nomatch", event);
        };
        this.recognition.onerror = (event) => {
            console.info("RecognitionManager error");
            clearTimeout(autoStopTimer);
            self.pubSubManager.publish("error", event);
        };
    }

    /**
     * 음성인식을 비활성화하는 함수
     *
     * @example
recognitionManager.stop(); 
     */
    stop(){
        this.recognition.stop();
    }

    /**
     * 음성인식시 발생하는 이벤트를 받는 함수 이다.
     * @param {String} eventName 이벤트 이름(result, start, autoend, end, speechend, speechstart, nomatch, error)
     * @param {RecognitionManager~callback} callback 콜백함수
     * @example
recognitionManager.on("start", (event)=>{
    console.info("음성인식이 시작되었습니다.");
});

recognitionManager.on("end", (event)=>{
    console.info("음성인식이 종료되었습니다.");
});

recognitionManager.on("speechstart", (event)=>{
    console.info("사용자가 말하기를 시작하였습니다.");
});

recognitionManager.on("speechend", (event)=>{
    console.info("사용자가 말하기를 종료하였습니다.");
});

recognitionManager.on("error", (event)=>{
    console.error(event.error);
});

recognitionManager.on("autoend", (event)=>{
    console.info("일정시간 동안 말을 하지 않아 자동 동료 되었습니다.");
});

recognitionManager.on("nomatch", (event)=>{
    console.info("신뢰 임계 값을 충족하는 값이 없습니다.");
});
     */
    on(eventName, callback){
        this.pubSubManager.subscribe(eventName, callback);
    }
     /**
     * 이벤트 발생시 실행되는 콜백함수
     *
     * @callback RecognitionManager~callback
     * @param {Object} event 이벤트 객체
     * @param {String} eventName 발생한 이벤트 이름
     */
}