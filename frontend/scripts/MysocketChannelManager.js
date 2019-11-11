var MysocketChannelManager = (function(){
	var N_TIMES_HISTORY=4;
	var COUPLE_SECONDS=2000;
	var TEN_SECONDS=10000;
	var WhenToCreate={'NOW':'now', 'SHORT_DELAY':'oneMinute', 'LONG_DELAY':'longDelay'};
	var _MysocketChannelManager = function(global, params){
		global['EventEnabledBuilder'](this);
		var self = this;
		var mysocketAnalysis = params['mysocketAnalysis'];
		var url = params['url'];
		var urlWebsocket = params['urlWebsocket'];
		var parameters = params['parameters'];
		var getId = params['getId'];
		var channel;
		var pendingCreate=false;
		var When = global['When'];
		this['wouldLikeNewChannel'] = function(){
			if(pendingCreate)return;
			var recommendedDelay = mysocketAnalysis['getRecommendedDelayBeforeCreatingChannel']();	
			switch(recommendedDelay['type']){
				case When['NOW']:
					return createNewChannel();
				case When['SECONDS']:
					var seconds = recommendedDelay['seconds'];
					createNewChannelAfterDelayMilliseconds(seconds*1000);
					break;
			}
		};
		function createNewChannelAfterDelayMilliseconds(milliseconds){
			pendingCreate = true;
			new (global['Timer'])({'delay':milliseconds, 'callback':callbackCreateChannel, 'nTicks':1})['start']();
		}
		function callbackCreateChannel(){
			disposeOldChannel();
			createNewChannel();
			dispatchNewChannel();
			pendingCreate=false;
		}
		function disposeOldChannel(){
			
		}
		function createNewChannel(){
			channel = global['MysocketChannelFactory']['create'](global, {'id':getId(), 'urlWebsocket':urlWebsocket, 'url':url, 'mysocketAnalysis':mysocketAnalysis, 'parameters':parameters});
			return channel;
		}
		function dispatchNewChannel(){
			self.dispatchEvent({'type':'newchannel', 'channel':channel});
		}
	};
	global['MysocketChannelManager']=_MysocketChannelManager;
	return _MysocketChannelManager;
})();