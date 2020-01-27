module.exports = (function(){
	const W3CWebSocket = require('websocket').w3cwebsocket;
	return function(url){
		var self = this;
		var client = new W3CWebSocket(url,"echo-protocol");
		client.onopen=onOpen;
		client.onclose=onClose;
		client.onmessage=onMessage;
		client.onerror=onError;
		this.send = function(msg){		
			if (client.readyState === client.OPEN)
				client.send(msg);
		};
		this.close = function(){client.close();};
		function onMessage(msg){
			self.onmessage&&self.onmessage(msg);
		}
		function onOpen(){			
				setTimeout(function(){
					self.onopen&&self.onopen();
				},0);
		}
		function onClose(){
			self.onclose&&self.onclose();
		}
		function onError(error){
			self.onerror&&self.onerror(error);
		}
	}
})();

 