module.exports=(function(path){
	var url = require('url');
	var Core = require('core');
	var Longpolls = Core.Longpolls;
	var Longpoll = Core.Longpoll;
	return function(mysockets, server, path){
		var longpolls = new Longpolls();
		const app = server.getApp();
		app.post(path, function(req, res, next){
			var data = JSON.parse(req.body);
			var mysocketId = data.id;
			var msg = data.msg;
			var longpoll;
			if(mysocketId){
				longpoll= longpolls.getById(mysocketId);
			}
			if(!longpoll)
			{	
				var ip = getIpFromRemoteAddress(req.connection.remoteAddress);
				var mysocket = mysockets.getOrCreateLongpoll(mysocketId, ip, msg, function(id){
					longpoll = new Longpoll({app:app, id:id, url:path});
					longpolls.add(longpoll);
					return longpoll;
				});
				if(!mysocket)
				{
					res.json({disposed:true});
					return;
				}
				mysocketId = mysocket.getId();
			}
			longpoll.incomingMessage(msg)
			res.send({id:mysocketId});
		});
	};
	function getIpFromRemoteAddress(remoteAddress){
		var regExp = new RegExp('::ffff:([0-9\.]+)');
		var res = regExp.exec(remoteAddress);
		if(!res)return;
		return res[1];
	}
})();