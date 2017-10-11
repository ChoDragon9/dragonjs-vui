describe("SpeechManager", ()=>{
	var speechManager = new SpeechManager();
	var noop = ()=>{};

	it("when cancel is called, synth.cancel have to call", ()=>{
		var spy = spyOn(speechManager.synth, 'cancel');
		speechManager.cancel(()=>{});

		expect(spy).toHaveBeenCalled();
	});

	it(`if length of string is bigger than ${speechManager.MAX_TEXT_LENGTH}, expection have to be occured with message`, ()=>{
    	var str = '';
   		for(var i = 0; i <= speechManager.MAX_TEXT_LENGTH; i++){
   			str += 'i';
   		}
   		try {
   			speechManager.speech(str);	
   		}catch(e){
    		expect(e).toBe(`Text to speech have to shorter then ${speechManager.MAX_TEXT_LENGTH}.`);
   		}
    });

	it("added event have to call correctly", function(){
		var eventName = "start";
		var isCalled = false;
		var callback = ()=>{
			isCalled = true;
		};

		speechManager.on(eventName, callback);
		speechManager.pubSubManager.publish(eventName);

		expect(isCalled).toBeTruthy();
	});

	it("when speech is called, start and end have to be occured", (done)=>{
		var isCalled = 0;
		speechManager.speech('apple');
		speechManager.on("start", function(){
			isCalled++;
		});
		speechManager.on("end", function(){
			isCalled++;

			expect(isCalled).toBe(2);
			done();
		});
	});

	it("when speech is called, synth.speak have to be called", ()=>{
		var spy = spyOn(speechManager.synth, 'speak');
		
		speechManager.speech('apple');

		expect(spy).toHaveBeenCalled();
	});
});