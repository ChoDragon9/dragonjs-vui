"use strict";
/* globals escape */
/**
 * Pub/Sub Pattern을 제공하는 객체이다.<br>
 * subscribe를 통해 Subscriber를 등록하고,
 * publish를 통해 Subscriber에게 Broadcast를 한다. <br>
 * 등록된 Subscriber는 unsubscribe를 통해 삭제할 수 있다.
 * 
 * @class
 * @example
var pubsubManager = new PubSubManager();
 */
class PubSubManager {
	constructor(){
		this.topics = {};
		this.subUid = -1;
	}

	encodeTopic(topic){
		return escape(topic);
	}

	/**
	 * Subscriber에게 Broadcast하는 기능을 제공한다.
	 * 
	 * @param {String} topic Broadcast 할 Topic 이름
	 * @param {String|Array|Object|Number} args Subscriber에게 전달할 데이터
	 * @returns {this} PubSubManager 객체, Chaining 패턴을 사용한다.
	 * @example
pubsubManager
  .publish("class/1") //me1 //me2
  .publish("class/2") //me3
  .publish("class/3"); //me4
	 */
	publish(topic, args){
		topic = this.encodeTopic(topic);

		if ( !this.topics[topic] ) {
			return false;
		}

		this.topics[topic].forEach(subscriber => {
			subscriber.func(args, topic);
		});

		return this;
	}

	/**
	 * Subscriber을 등록하는 함수이다.
	 * 
	 * @param {String} topic Subscriber의 Topic 이름
	 * @param {PubSubManager~callback} func Publish되었을 때 실행할 함수
	 * @returns {String} token
	 * @example
var token1 = pubsubManager.subscribe("class/1", function(){
  console.log("me1");
});
var token2 = pubsubManager.subscribe("class/1", function(){
  console.log("me2");
});
var token3 = pubsubManager.subscribe("class/2", function(){
  console.log("me3");
});
var token4 = pubsubManager.subscribe("class/3", function(){
  console.log("me4");
});
	 */
	subscribe(topic, func){
		topic = this.encodeTopic(topic);

		if (!this.topics[topic]) {
			this.topics[topic] = [];
		}

		var token = ( ++this.subUid ).toString();

		this.topics[topic].push({
			token: token,
			func: func
		});

		return token;
	}

	/**
	 * 예외 발생시 실행될 콜백함수
	 *
	 * @callback PubSubManager~callback
	 * @param {String|Array|Number|Object} args Publish되었을 때 실행할 함수
	 * @param {String} topic Topic 이름
	 */

	/**
	 * Subscriber을 삭제하는 함수이다.
	 * 
	 * @param {String} token Subscriber의 token
	 * @returns {this} PubSubManager 객체, Chaining 패턴을 사용한다.
	 * @example
pubsubManager
  .unsubscribe(token1)
  .unsubscribe(token2)
  .publish("class/1") //Nothing
  .publish("class/2") //me3
  .publish("class/3"); //me3
	 */
	unsubscribe(token){
		for ( var m in this.topics ) {
			for ( var i = 0, j = this.topics[m].length; i < j; i++ ) {
				if ( this.topics[m][i].token === token ) {
				    this.topics[m].splice( i, 1 );
				    return this;
				}
			}
		}
		return this;
	}
}