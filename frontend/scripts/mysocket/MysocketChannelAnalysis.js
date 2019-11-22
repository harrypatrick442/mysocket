var MysocketChannelAnalysis = (function(){
	var N_ERRORS_TO_STORE=30;
	var _MysocketChannelAnalysis = function(global, channelType){
		global['EventEnabledBuilder'](this);
		var self = this;
		var successfullyOpened =false;
		var receivedMessages=false;
		var closed = false;
		var errors=[];
		var openedAt;
		var closedAt;
		var stopWatchOpenFor = new (global['StopWatch'])();
		this['getSuccessfullyOpened']= function(){
				return successfullyOpened;
		};
		this['getOpenForMilliseconds'] = stopWatchOpenFor['getMilliseconds'];
		this['getOpenForSeconds'] = stopWatchOpenFor['getSeconds'];
		this['getOpenedAt'] = function(){
			return openedAt;
		};
		this['getClosedAt'] = function(){
			return closedAt;
		};
		this['getChannelType'] =function(){
			return channelType;
		};
		this['opened'] = function(){
			successfullyOpened=true;
			openedAt = getTime();
			stopWatchOpenFor['start']();
		};
		this['receivedMessage'] = function(){
			receivedMessages = true;
		};
		this['closed']= function(){
			stopWatchOpenFor['stop']();
			closed = true;
			closedAt = getTime();
			dispatchClosed();
		};
		this['error'] = function(error){
			errors.push(error);
			while(errors.length>N_ERRORS_TO_STORE)errors.splice(0, 1);
		};
		function dispatchClosed(){
			self['dispatchEvent']({'type':'closed', 'mysocketChannelAnalysis':self});
		}
	};
	global['MysocketChannelAnalysis']=_MysocketChannelAnalysis;
	return _MysocketChannelAnalysis;
	function getTime(){
		return new Date().getTime();
	}
})();