describe("LanguageManager", ()=>{
	var languageManager = new LanguageManager();

	it("getVoices function have to get Array of supporting language in system", ()=>{

		languageManager.getVoices((voices)=>{
			expect(Array.isArray(voices)).toBeTruthy();
		});
	});

	it("when getValidLanguage is called, getVoices have to call.", ()=>{
		var spyForGetVoices = spyOn(languageManager, 'getVoices');
		languageManager.getValidLanguage(()=>{});

		expect(spyForGetVoices).toHaveBeenCalled();
	});

	it("called times of getValidLanguage callback and called times of getVoices have to same", ()=>{
		var count = 0;
		languageManager.getValidLanguage(()=>{
			count++;
		});
		languageManager.synth.onvoiceschanged();

		expect(count).toBe(2);
	});
});