module.exports = new (function(){
	var TIMEOUT_CHANNEL_LONGPOLL= 120000;
	var Core = require('core');
	var Mysocket = require('./Mysocket');
	var ChannelType = Core.ChannelType;
	this.create = function(params){
		var id = params.id;
		if(params.ws)
			return new Websocket(params.ws);
		else 
			return new Longpoll(params.longpoll);
		throw new Error('Not implemented');
	};
	function Websocket(ws){
		var self = this;
		var closed = false;
		this.channelType = ChannelType.WEBSOCKET;
		this.getChannelType = function(){
			return ChannelType.WEBSOCKET;
		};
		this.sendMessage=function(msg){
			try{ws.send(JSON.stringify(msg));}catch(ex){console.log(ex);}
		};
		ws.on('message', function(msg) {
			self.onMessage&&self.onMessage(JSON.parse(msg));
		});
		ws.on('close', function(){
			closed=true;
			self.onClose&&self.onClose();
		});
		this.isAlive=function(){
			return !closed;
		};
		this.close = function(){
			closed=true;
			ws.close();
		};
	}
	function Longpoll(longpoll){ 
		var self = this;
		var closed = false;
		var messageQueue=[];
		this.channelType = ChannelType.LONGPOLL;
		this.getChannelType = function(){
			return ChannelType.LONGPOLL;
		};
		this.sendMessage=function(msg){
			longpoll.send(msg);
		};
		longpoll.onMessage = function(msg){
			self.onMessage(msg);
		};
		this.isAlive=function(time){
			return !longpoll.getDisposed()&&(time - longpoll.getLastActive()<TIMEOUT_CHANNEL_LONGPOLL);
		};
		this.close = function(){
			longpoll.dispose();
			closed=true;
		};
	}
})();
