const CHANNEL_OPEN='channelOpen';
const CHANNEL_CLOSE='channelClose';
const request = require('request');
const fs = require('fs');
const path = require('path');
const Enums = require('enums');
const Core = require('core');
const Ajax = Core.Ajax;
const each = Core.each;
const WebSocketClient = require('./WebSocketClient');
Core.Linq;
const Timer = Core.Timer;
const requireRaw = Core.requireRaw;
const S = require('strings').S;
const Mysocket = require('./../index');
const mysocketFolder = Mysocket.getScriptsAbsolutePath()+'/mysocket/';
const coreFolder = Core.getScriptsAbsolutePath()+'/core/';
const enumsFolder = Enums.getScriptsAbsolutePath()+'/enums/';
var scope = {
	console:{log:console.log, error:console.error}, 
	Array:Array,
	Ajax:Ajax,
	Timer:Timer, 
	each:each,
	JSON:JSON,	
	//WebSocket:WebSocketClient,
	S:S
};//todo eventually the frontend component used in the backend will also be precompiled.
requireRaw(coreFolder+'ChannelType.js', scope);
requireRaw(coreFolder+'Enumerable.js', scope);
requireRaw(coreFolder+'When.js', scope);
requireRaw(coreFolder+'StopWatch.js', scope);
requireRaw(coreFolder+'Iterator.js', scope);
requireRaw(coreFolder+'EventEnabledBuilder.js', scope);
requireRaw(coreFolder+'Longpoll.js', scope);
requireRaw(coreFolder+'UrlHelper.js', scope);
requireRaw(coreFolder+'TemporalCallback.js', scope);
requireRaw(mysocketFolder+'MysocketChannelAnalysis', scope);
requireRaw(mysocketFolder+'MysocketChannelAnalysis', scope);
requireRaw(mysocketFolder+'MysocketChannelAnalysis', scope);
requireRaw(mysocketFolder+'MysocketChannelFactory', scope);
requireRaw(mysocketFolder+'MysocketChannelManager', scope);
requireRaw(mysocketFolder+'MysocketAnalysis', scope);
requireRaw(mysocketFolder+'Mysocket', scope);
module.exports = function(params){
	return new scope.Mysocket(scope, params);
};