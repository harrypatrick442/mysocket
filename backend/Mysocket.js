module.exports = (function(){
	const TIMEOUT_CLOSED_CHANNEL_MINUTES = 2;
	var Core = require('core');
	var ChannelType = Core.ChannelType;
	var channelFactory = require('./MysocketChannelFactory');
	var EventEnabledBuilder=Core.EventEnabledBuilder;
	var dispatchedChannelOpen = false;
	var _Mysocket = function(params){
		EventEnabledBuilder(this);
		var self = this;
		var id = params.id;
		var handler = params.handler;
		var channel;
		var timeChannelClosed=getTime();
		updateChannel(params);
		this.setIp = function(value){
			params.ip=value;
		};
		this.close=function(){
			channel&&channel.close&&channel.close();
			_channelClose();
			dispatchChannelClose();
			dispatchClose();
		};
		this.setWebsocket = updateChannel;
		this.getChannelType = function(){
			if(!channel)return;
			return channel.getChannelType();
		};
		this.setToLongpoll = function(longpoll){
			updateChannel({longpoll:longpoll});
		};
		this.getId = function(){
			return params.id;
		};
		this.getIp = function(){
			return params.ip;
		};
		this.sendMessage = this.send  = sendMessage; 
		this.incomingMessage = onMessage;
		this.isActive = function(time){
			if(channel)
				return channel.isAlive(time);
			return getTimeSinceChannelClosedMinutes()<TIMEOUT_CLOSED_CHANNEL_MINUTES;
		};
		function updateChannel(params){
			if(channel){//new
				channel.close&&channel.close();
				_channelClose();
				dispatchChannelClose();
			}//new
			channel = channelFactory.create(params);
			channel.onClose=onClose;
			channel.onMessage=onMessage;
			onOpen();
		}
		function getTimeSinceChannelClosedMinutes(){
			return (getTime()-timeChannelClosed)/60000;
		}
		function getTime(){
			return new Date().getTime();
		}
		function dispatchClose(){
			self.dispatchEvent({type:'close', mysocket:self});
		}
		function onMessage(msg){
			handler&&handler.process(msg, self, sendMessage);
			dispatchOnMessage(msg);
		}
		function onOpen(){
			sendMessage({type:'mysocket_id', id:id});
			setTimeout(dispatchChannelOpen);
		}
		function onClose(){
			_channelClose();
			dispatchChannelClose();
		}
		function _channelClose(){
			if(!channel)return;
			channel.onClose=null;
			channel.onOpen = null;
			timeChannelClosed = getTime();
			channel = null;
		}	
		function sendMessage(msg){console.log(msg);
		console.log('sendMessage');
			channel&&channel.sendMessage(msg);
		}
		function nothing(){}
		function dispatchOnMessage(msg){
			self.dispatchEvent({type:'message', msg:msg});
		}
		function dispatchChannelOpen(){
			if(dispatchedChannelOpen)return;
			dispatchedChannelOpen=true;
			self.dispatchEvent({type:'channelOpen', id:id});
		}
		function dispatchChannelClose(){
			if(!dispatchedChannelOpen)return;
			dispatchedChannelOpen=false;
			self.dispatchEvent({type:'channelClose', id:id});
		}
	};
	_Mysocket.fromWebsocket = function(params){
		return new _Mysocket(params);
	};
	_Mysocket.fromLongpoll=function(params){
		return new _Mysocket(params);
	};
	return _Mysocket;
})();
