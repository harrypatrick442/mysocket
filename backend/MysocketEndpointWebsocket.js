module.exports = (function(){
	var expressWs;
	const Core = require('core');
	const ChannelType = Core.ChannelType;
	const url = require('url');
	return function(mysockets, app, server, path){
		var expressWs = getExpressWs(app, server);
		app.get(path, function(req, res, next){
		  res.end();
		});
		app.ws(path, function(ws, req) {
			try{
				var parameters = url.parse(req.url, true).query;
				var mysocketId = parameters.mysocketId;
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
			}catch(ex){console.log(ex);}
		});
	};
	function getExpressWs(app, server){
		if(!expressWs)
			expressWs = require('express-ws')(app, server);
		return expressWs;
	}
	function getIpFromRemoteAddress(remoteAddress){
		var regExp = new RegExp('::ffff:([0-9\.]+)');
		var res = regExp.exec(remoteAddress);
		if(!res)return;
		return res[1];
	}
})();