module.exports = (function(){
	const Core = require('core');
	const ChannelType = Core.ChannelType;
	const url = require('url');
	return function(mysockets, server, path){
		var app = server.getApp();
		server.websocketEnable();
		app.get(path, function(req, res, next){
		  res.end();
		});
		app.ws(path, function(ws, req) {
			try{
				var params = url.parse(req.url, true).query;
				var parameters = JSON.parse(decodeURIComponent(params.parameters));
				var mysocketId = params.mysocketId;
				var ip = getIpFromRemoteAddress(req.connection.remoteAddress);
				var params = {id:mysocketId, ws:ws, ip:ip, parameters:parameters};
				var mysocket = mysockets.getOrCreateWebsocket(params);
				if(!mysocket){
					if(mysocketId){
						ws.send(JSON.stringify({disposed:true, callstack:new Error().stack}));
					}
					return;
				}
				//if(ip)	mysocket.setIp(ip);
			}catch(ex){console.error(ex);}
		});
	};
	function getIpFromRemoteAddress(remoteAddress){
		var regExp = new RegExp('::ffff:([0-9\.]+)');
		var res = regExp.exec(remoteAddress);
		if(!res)return;
		return res[1];
	}
})();