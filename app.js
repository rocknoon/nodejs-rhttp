var express = require('express');
var rhttp   = require('./module/rhttp').Instance();


var app = express.createServer();

app.get('/api/url', function(req, res){
	
	res.header('Content-Type', 'application/xml;charset=UTF-8');
	res.header('Server' , "NodeJs 4.11");
	
	var url = req.param("url");
	
	try{
		
		rhttp.exec( url, function( rtn ){
			res.send('<?xml version="1.0" encoding="utf-8"?> <root><title>'+ rtn.title +'</title></root>' );
		} );
		
	}catch( ex ){
		res.send('<?xml version="1.0" encoding="utf-8"?> <root><error>'+ ex +'</error></root>' );
	}
	
});


app.listen(3000);
console.log('Express app started on port 3000');