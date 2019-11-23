module.exports = (function(){
	var Core = require('core');
	var Set = Core.Set;
	var EventEnabledBuilder= Core.EventEnabledBuilder;
	var MysocketCleanup=require('./MysocketCleanup');
	var Mysocket = require('./Mysocket');
	var ChannelType = Core.ChannelType;
	var uuid = require('uuid');
	return function(handler){
		EventEnabledBuilder(this);
		var self = this;
		var set = new Set({getEntryId:getEntryId});
		var mysocketCleanup = new MysocketCleanup(this);
		this.getOrCreateWebsocket = function(params){
			var id = params.id;
			var ws = params.ws;
			var ip = params.ip;
			var parameters = params.parameters;
			var mysocket;
			if(id)
			{
				mysocket = getById(id);
				if(!mysocket)return;
				if(mysocket.getChannelType()!=ChannelType.WEBSOCKET)
					mysocket.setWebsocket(params);
				return mysocket;
			}
			mysocket = Mysocket.fromWebsocket({ws:ws, id:getNewId(), ip:ip, handler:handler});
			set.add(mysocket);
			addEvents(mysocket);
			dispatchAdd(mysocket, parameters);
			return mysocket;
		};
		this.getOrCreateLongpoll=function(id, ip, parameters, createLongpoll){
			var mysocket;
			if(id){
				mysocket = getById(id);
				if(!mysocket)return;
				mysocket.setToLongpoll(createLongpoll(id));
				return mysocket;
			}
			else
				id=getNewId();
			mysocket = Mysocket.fromLongpoll({longpoll:createLongpoll(id), id:id, ip:ip, handler:handler});
			set.add(mysocket);
			addEvents(mysocket);
			dispatchAdd(mysocket, parameters);
			return mysocket;
		};
		this.getNewId=getNewId;
		this.getNConnections= function(){
			return set.size;
		};
		function dispatchAdd(mysocket, parameters){
			self.dispatchEvent({type:'add', mysocket:mysocket, parameters:parameters});
		}
		function dispatchRemove(mysocket){
			self.dispatchEvent({type:'remove', mysocket:mysocket});
		}
		function addEvents(mysocket){
			mysocket.addEventListener('close', onClose);
		}
		function onClose(e){
			var mysocket = e.mysocket;
			set.remove(mysocket);
			dispatchRemove(mysocket);
		}
		function getById(id){	
			return set.getById(id);
		}
		function getNewId(){
			return uuid.v4();
		}
		function getEntryId(mysocket){
			return mysocket.getId();
		}
	};
})();