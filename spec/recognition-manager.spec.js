describe("RecognitionManager", ()=>{
	var recognitionManager = new RecognitionManager();
	var noop = ()=>{};
	jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

	it("addWord have to return string token", ()=>{
    	var token = recognitionManager.addWord("test", noop);
        expect(typeof token).toBe("string");
    });

    it(`if length of word is bigger than ${recognitionManager.MAX_TEXT_LENGTH}, expection have to be occured with message`, ()=>{
    	var str = '';
   		for(var i = 0; i <= recognitionManager.MAX_TEXT_LENGTH; i++){
   			str += 'i';
   		}
   		try {
   			recognitionManager.addWord(str, noop);	
   		}catch(e){
    		expect(e).toBe(`word have to shorter then ${recognitionManager.MAX_TEXT_LENGTH}.`);
   		}
    });

	it("removeWord must be able to remove added word from returned token", ()=>{
		var word = "apple";
    	var token = recognitionManager.addWord(word, noop);

    	expect(recognitionManager._words[token]).toBe(word);

    	recognitionManager.removeWord(token);

    	expect(recognitionManager._words[token]).not.toBe(word);
    });

    it("clearWord have to clear added words", ()=>{
    	var word = 'apple';
    	var total = 10;

    	recognitionManager.clearWord();

    	for(var i = 1; i <= total; i++){
    		recognitionManager.addWord(`${word} ${i}`, noop);	
    	}

    	expect(Object.keys(recognitionManager._words).length).toBe(total);

    	recognitionManager.clearWord();

    	expect(Object.keys(recognitionManager._words).length).toBe(0);
    });

    it("addSentence have to return string token", ()=>{
		var token = recognitionManager.addSentence("test", noop);
	    expect(typeof token).toBe("string");
	});

	it(`if length of sentence is bigger than ${recognitionManager.MAX_TEXT_LENGTH}, expection have to be occured with message`, ()=>{
		var str = '';
		for(var i = 0; i <= recognitionManager.MAX_TEXT_LENGTH; i++){
			str += 'i';
		}
		try {
			recognitionManager.addSentence(str, noop);	
		}catch(e){
		expect(e).toBe(`Sentence have to shorter then ${recognitionManager.MAX_TEXT_LENGTH}.`);
		}
	});

	it("removeSentence must be able to remove added sentence from returned token", ()=>{
	  	var sentence = "apple";
		var token = recognitionManager.addSentence(sentence, noop);

		expect(recognitionManager._sentence[token]).toBe(sentence);

		recognitionManager.removeSentence(token);

		expect(recognitionManager._sentence[token]).not.toBe(sentence);
	});

	it("clearSentence have to clear added sentences", ()=>{
		var sentence = 'apple';
		var total = 10;
		
		recognitionManager.clearSentence();

		for(var i = 1; i <= total; i++){
			recognitionManager.addSentence(`${sentence} ${i}`, noop);	
		}

		expect(Object.keys(recognitionManager._sentence).length).toBe(total);

		recognitionManager.clearSentence();

		expect(Object.keys(recognitionManager._sentence).length).toBe(0);
	});

	it("when stop is called, recognition.stop have to call", ()=>{
		var spy = spyOn(recognitionManager.recognition, 'stop');
		recognitionManager.stop(()=>{});

		expect(spy).toHaveBeenCalled();
	});

	it("added event have to call correctly", function(){
		var eventName = "start";
		var isCalled = false;
		var callback = ()=>{
			isCalled = true;
		};

		recognitionManager.on(eventName, callback);
		recognitionManager.pubSubManager.publish(eventName);

		expect(isCalled).toBeTruthy();
	});

	it("when start is called, added event have to call correctly", ()=>{
		var spy = spyOn(recognitionManager.recognition, 'start');
		var count = 0;
		var callback = ()=>{
			count++;
		};
		var eventList = [
			'result',
			'end',
			'start',
			'speechend',
			'speechstart',
			'nomatch',
			'error'
		];

		for(var i = 0, ii = eventList.length; i < ii; i++){
			var eventName = eventList[i];
			recognitionManager.on(eventName, callback);	
		}

		recognitionManager.start();


		var event = {
			results: [
				[
					{
						transcript: 'Test'
					}
				]
			]
		};

		for(var i = 0, ii = eventList.length; i < ii; i++){
			var eventName = "on" + eventList[i];
			recognitionManager.recognition[eventName](event);
		}

		recognitionManager.stop();

		expect(spy).toHaveBeenCalled();
		expect(count).toBe(eventList.length);
	});

	it(`autoend event have to be called after ${recognitionManager.AUTO_STOP_TIME}, when start event is called and speechstart event is not called.`, (done)=>{
		var isCalled = false;

		recognitionManager.start();
		recognitionManager.on("autoend", function(){
			isCalled = true;
		});
		recognitionManager.recognition.onstart();
		recognitionManager.recognition.onend = noop;
		recognitionManager.recognition.onerror = noop;

		setTimeout(function(){
			expect(isCalled).toBe(true);
			recognitionManager.stop();
			done();
		}, recognitionManager.AUTO_STOP_TIME);
	});

	it('when lang is setted, it have to use setted lang', (done)=>{
		var lang = 'en-US';

		recognitionManager.stop();

		setTimeout(function(){
			expect(recognitionManager.recognition.lang).not.toBe(lang);
			recognitionManager.start(lang);
			expect(recognitionManager.recognition.lang).toBe(lang);
			done();
		});
	});
});