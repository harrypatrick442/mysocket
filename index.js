const RepositoriesHelper = require('repositories_helper');
module.exports={
	Mysocket:require('./backend/Mysocket'),
	MysocketChannelFactory:require('./backend/MysocketChannelFactory'),
	MysocketCleanup:require('./backend/MysocketCleanup'),
	MysocketEndpointLongpoll:require('./backend/MysocketEndpointLongpoll'),
	MysocketEndpointWebsocket:require('./backend/MysocketEndpointWebsocket'),
	Mysockets:require('./backend/Mysockets'),
	getScriptsRelativePath:RepositoriesHelper.getGetScriptsRelativePath(),
	getScriptsAbsolutePath:RepositoriesHelper.getGetScriptsAbsolutePath()
};