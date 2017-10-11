"use strict";
/* globals removeClassOfPeachFace, addErrorTextInChat, addClassOfPeachFace, getElemid, addInputTextInChat, SpeechManager */
function initSpeechSynthesis(){
	var speechManager = new SpeechManager();

	speechManager.on("end", () => {
		removeClassOfPeachFace("speaking");
	});

	speechManager.on("error", (event) => {
		var txt = "";

		switch(event.error){
			case "canceled":
				txt = `취소 메서드 호출로 인해 SpeechSynthesisUtterance가 
				시작되기 전에 큐에서 제거되었습니다.`;
			break;
			case "interrupted":
				txt = `취소 메서드 호출로 인해 SpeechSynthesisUtterance가 
				시작된 후 및 완료되기 전에 중단되었습니다.`;
			break;
			case "audio-busy":
				txt = `사용자 에이전트가 오디오 출력 장치에 액세스 할 수 
				없기 때문에 작업을 지금 완료 할 수 없습니다.
				예를 들어 사용자가 다른 응용 프로그램을 닫아서이 문제를 해결해야 할 수도 있습니다.`;
			break;
			case "audio-hardware":
				txt = `사용자 에이전트가 오디오 출력 장치를 식별 할 수 없기 
				때문에 작업을 지금 완료 할 수 없습니다. 예를 들어 사용자가 
				스피커에 연결하거나 시스템 설정을 구성해야 할 수 있습니다.`;
			break;
			case "network":
				txt = "일부 네트워크 통신에 실패 했으므로 지금은 작업을 완료 할 수 없습니다.";
			break;
			case "synthesis-unavailable":
				txt = `사용할 수있는 합성 엔진이 없으므로이 시점에서 작업을 
				완료 할 수 없습니다. 예를 들어 사용자가 합성 엔진을 
				설치하거나 구성해야 할 수 있습니다.`;
			break;
			case "synthesis-failed":
				txt = "합성 엔진에 오류가있어서 작업을 수행하지 못했습니다.";
			break;
			case "language-unavailable":
				txt = `SpeechSynthesisUtterance 언어로 지정된 언어에 
				적절한 음성을 사용할 수 없습니다.`;
			break;
			case "voice-unavailable":
				txt = `SpeechSynthesisUtterance 음성 속성에서 지정된 
				음성을 사용할 수 없습니다.`;
			break;
			case "text-too-long":
				txt = `SpeechSynthesisUtterance 텍스트 특성의 내용이 
				너무 길어서 합성 할 수 없습니다.`;
			break;
			case "invalid-argument":
				txt = `합성기에서는 SpeechSynthesisUtterance 속도, 
				피치 또는 볼륨 특성의 내용을 지원하지 않습니다.`;
			break;
		}

		addErrorTextInChat(txt);
	});

	speechManager.on("start", () => {
		addClassOfPeachFace("speaking");
	});

	/* 텍스트 말하기 */
	getElemid("speech-button").onclick = () => {
		var txt = addInputTextInChat("말하기");
		if(txt !== false){
			speechManager.speech(txt);	
		}
	};
}