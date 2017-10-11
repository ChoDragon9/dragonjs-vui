describe("PubSubManager", ()=>{
	var pubSubManager = new PubSubManager();
	var topic1 = "apple";
	var topic2 = "banana";
	var noop = ()=>{};

    it("subscribe have to return string token", ()=>{
    	var token = pubSubManager.subscribe(topic1, noop);
        expect(typeof token).toBe("string");
    });

    it("subscribe have to return diffrent token each subscriber that event though topic is same.", ()=>{
    	var topic1_token1 = pubSubManager.subscribe(topic1, noop);
        var topic1_token2 = pubSubManager.subscribe(topic1, noop);
    	var topic2_token1 = pubSubManager.subscribe(topic2, noop);

        expect(topic1_token1).not.toBe(topic1_token2);
        expect(topic1_token2).not.toBe(topic2_token1);
        expect(topic2_token1).not.toBe(topic1_token1);
    });

    it("publish have to broadcast correctly", ()=>{
        var publishData = 0;
        let result;
        var token = pubSubManager.subscribe(topic1, (data)=>{
            result = data;
        });
        var token2 = pubSubManager.subscribe(topic2, (data)=>{
            result = 1;
        });

        pubSubManager.publish(topic1, publishData);

        expect(result).toBe(publishData);
    });

    it("when publish is called by undefined token, it have to return false", ()=>{
        var publishReturnVal = pubSubManager.publish('token');

        expect(publishReturnVal).toBeFalsy();
    });

    it("when unsubscribe is called, subscriber is removed from token", ()=>{
        var publishData = 0;
        let result;
        var token = pubSubManager.subscribe(topic1, (data)=>{
            result = data;
        });

        pubSubManager.unsubscribe(token);

        pubSubManager.publish(topic1, publishData);

        expect(result).not.toBe(publishData);
    });

    it("when unsubscribe is called by undefined token, it have to return PubSubManager", ()=>{
        var thisObject = pubSubManager.unsubscribe('token');

        expect(thisObject).toBe(pubSubManager);
    });
});