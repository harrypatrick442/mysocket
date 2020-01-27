var MysocketChannelFactory = new (function(){
	global['MysocketChannelFactory']=this;
	this['create'] = function(global, params){
		var mysocketAnalysis = params['mysocketAnalysis'];
		var recommendedChannelTypes = mysocketAnalysis['getRecommendedTypes']();
		var parameters = params['parameters'];
		switch(recommendedChannelTypes[0]){
			case global['Mysocket']['WEBSOCKET']:
				return new _Websocket(global, params['id'], params['urlWebsocket'], parameters);
			case global['Mysocket']['JSONP']:
			default:
				return new _Longpoll(global, params['id'], params['url'], parameters);
		}
	};
	function _Websocket(global, id, url, parameters){
		var self = this;
		var analysis = new (global['MysocketChannelAnalysis'])(global, ChannelType['WEBSOCKET']);
		var websocket;
		var disposedByServer = false;
		var closed = false;
		this['send'] = function(msg){
			try{
			websocket.send(JSON.stringify(msg));
			}
			catch(ex){
				console.error(ex);
				try{
				websocket.close();
				}catch(exClosing){
					
				}
				onClose();
			}
		};
		this['getAnalysis']= function(){
			return analysis;
		};
		this['getChannelType'] = function(){
			return ChannelType['WEBSOCKET'];
		};
		this['isOpen'] = function(){
			return websocket&&(websocket['readyState']==websocket['OPEN']);
		};
		this['close']=close;
		//new Task(function(){onClose('test');}).run();
		//return;
		websocket = new WebSocket(UrlHelper/*test*/['addParameters'](url+(id?'?mysocketId='+id:''), parameters));
		websocket['onmessage'] = onMessage;
		websocket['onopen'] = onOpen;
		websocket['onclose']=onClose;
		websocket['onerror'] = onError;
		function close(){
			if(closed)return;
			try{
			websocket['close']();
			}catch(ex){
				console.error(ex);
			}//patching up bug.
			onClose();
		};
		this['getDisposedByServer'] = function(){
			return disposedByServer;
		};
		global['channel'] = this;
		function onMessage(e){
			var data = e['data'];
			if(data===undefined||data===null||data==='')return;
			var msg = global.JSON.parse(data);	
			if(msg['mysocketId']){
				id=msg['mysocketId'];
			}
			if(msg['disposed']){
				disposedByServer = true;
				websocket['close']();
				return;
			}
			analysis['receivedMessage']();
			self['onMessage']&&self['onMessage'](msg);
		}
		function onOpen(){
			if(closed)return;
			analysis['opened']();
			self['onOpen']&&self['onOpen']();
		}
		function onClose(){
			if(closed)return;
			closed=true;
			analysis['closed']();
			self['onClose']&&self['onClose'](self);
		}
		function onError(err){
			analysis['error'](err);
			self['onError']&&self['onError'](err);
		}
	}
	function _Longpoll(global, id, url, parameters){
		var self = this;
		var closed=false;
		var lastErrorAt;
		var analysis = new (global['MysocketChannelAnalysis'])(global, ChannelType['LONGPOLL']);
		var longpoll = new (global['Longpoll'])(global, {'url':url, 'id':id});
		longpoll['onMessage']= onMessage;
		longpoll['onError'] = onError;
		longpoll['onSent'] = nothing;//onOpen
		longpoll['onDispose'] = close;
		
		global['channel'] = this;
		this['close']= close;
		this['send'] = longpoll['send'];
		this['getAnalysis']= function(){
			return analysis;
		};
		this['getChannelType'] = function(){
			return ChannelType['LONGPOLL'];
		};
		this['getDisposedByServer'] = longpoll['getDisposedByServer'];
		setTimeout(function(){onOpen(parameters);}, 0);
		function nothing(){}
		function onMessage(msg){
			analysis['receivedMessage']();
			self['onMessage']&&self['onMessage'](msg);
		}
		function onOpen(parameters){
			if(closed)return;
			analysis['opened']();
			if(parameters)
				self['send'](parameters);
			self['onOpen']&&self['onOpen']();
		}
		function onClose(){
			analysis['closed']();
			self['onClose']&&self['onClose']();
		}
		function onError(err){
			analysis.error(err);
			//var now = getTime();
			//if(secondErrorInTenSeconds)        
				close();
			//else lastErrorAt= now;
			self['onError']&&self['onError'](err);
		}
		function getTime(){
			return new Date().getTime()-10000;
		}
		function close(){
			if(closed)return;
			closed=true;
			longpoll['dispose']();
			onClose();
		}
		function secondErrorInTenSeconds(now){
			return lastErrorAt&&lastErrorAt<now;
		}
		this['isOpen']= function(){
			return !closed;
		};
	}
})();