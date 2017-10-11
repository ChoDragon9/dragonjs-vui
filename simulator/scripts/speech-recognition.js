"use strict";
/* globals removeClassOfPeachFace, addErrorTextInChat, addClassOfPeachFace, getElemid, addInputTextInChat, addTextInChat, RecognitionManager */

let speechRecognitionState = null;

function changeSpeechRecognitionButtonState(speechRecognitionState){
	var btnText = speechRecognitionState ? "음성인식 비활성화" : "음성인식 활성화";
	var msgText = speechRecognitionState ? "음성인식 활성화" : "음성인식 비활성화";

	addTextInChat(`${msgText} 되었습니다.`, false, true);
	getElemid("speech-recognition-toggle-button").textContent = btnText;
}

function initSpeechRecognition(){
	var recognitionManager = new RecognitionManager();
	speechRecognitionState = false;

	recognitionManager.addWord("아쿠아", () => {
		addTextInChat("'아쿠아'가 인식되었습니다.");
	});

	recognitionManager.addWord("빨강", () => {
		addTextInChat("'빨강'이 인식되었습니다.");
	});

	recognitionManager.on("end", () => {
		speechRecognitionState = false;
		changeSpeechRecognitionButtonState(speechRecognitionState);
		removeClassOfPeachFace("listening");
	});

	recognitionManager.on("error", (event) => {
		var txt = "";

		switch(event.error){
			case "no-speech":
				txt = "연설이 감지되지 않았습니다.";
			break;
			case "aborted":
				txt = `음성 입력은 사용자가 음성 입력을 취소 할 수 있게하는
				UI와 같은 일부 사용자 에이전트 별 동작에 의해 중단되었습니다.`;
			break;
			case "audio-capture":
				txt = "오디오 캡처에 실패했습니다.";
			break;
			case "network":
				txt = "인식을 완료하는 데 필요한 일부 네트워크 통신에 실패했습니다.";
			break;
			case "not-allowed":
				txt = `사용자 에이전트는 보안, 프라이버시 또는 사용자 선호도
				때문에 어떠한 음성 입력도 허용하지 않습니다.`;
			break;
			case "service-not-allowed":
				txt = `사용자 에이전트는 웹 응용 프로그램이
				요청한 음성 서비스를 허용하지 않지만 사용자 에이전트가 선택한
				하나를 지원하지 않기 때문에 또는 보안, 개인 정보 또는 사용자
				기본 설정의 이유로 일부 음성 서비스를 사용할 수 있습니다.`;
			break;
			case "bad-grammar":
				txt = `음성 인식 문법이나 의미 태그에 오류가 있거나 문법
				형식이나 의미 태그 형식이 지원되지 않습니다.`;
			break;
			case "language-not-supported":
				txt = "언어가 지원되지 않았습니다.";
			break;
		}

		addErrorTextInChat(txt);
	});

	recognitionManager.on("start", () => {
		speechRecognitionState = true;
		changeSpeechRecognitionButtonState(speechRecognitionState);
		addClassOfPeachFace("listening");
	});

	recognitionManager.on("autoend", () => {
		addTextInChat("자동비활성화가 실행됩니다.");
	});

	recognitionManager.on("speechstart", () => {
		addTextInChat("인식중", false, true);
	});

	recognitionManager.on("result", (result, topic) => {
		addTextInChat(`음성인식 결과: ${result}`);
	});

	/* 음성인식 활성화 */
	getElemid("speech-recognition-toggle-button").onclick = () => {
		speechRecognitionState = !speechRecognitionState;

		if(speechRecognitionState){
			recognitionManager.start('ko-KR');	
		}else{
			recognitionManager.stop();
		}
	};

	/* 텍스트 인식하기 */
	getElemid("speech-recognition-button").onclick = () => {
		var txt = addInputTextInChat("인식하기");

		if(txt !== false){
			recognitionManager.addSentence(txt, (data, topic) => {
				addTextInChat(`"${data}"가 인식되었습니다.`);
			});

			if(speechRecognitionState === false){
				speechRecognitionState = true;
				recognitionManager.start('ko-KR');
			}
		}
	};
}