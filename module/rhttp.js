	/**
	 * 
	 * @returns
	 */

	var http = require("http");
	
	
	var rhttp = function(){
		
	};
	
	rhttp.prototype = {
			
			
		exec : function( url, callback ){
			
			var urlOpt = this._parseUrl( url );
			this._requestUrl( urlOpt, callback );
		},
		
		/**
		 * @return {
		 * 	host : 
		 *  port : 
		 *  path : 
		 *  method : 
		 * }
		 */
		_parseUrl : function( url ){
			
			try{
				var regular = new RegExp("http://[^/]+");
				var protocalDomain = regular.exec( url );
				var protocalDomainLength = protocalDomain[0].length;
				var path = url.substr(protocalDomainLength);
				regular = new RegExp("//[^/]+");
				var domain = regular.exec( protocalDomain );
				regular = new RegExp("[^/]+");
				domain  = regular.exec( domain );
			}catch( ex ){
				throw new Error("sorry, the url is not correct");
			}
			
			
			
			var options = {
					host: domain[0],
					port: 80,
					path: path,
					method: 'GET'
			};
			
			return options;
			
		},
		
		/**
		 * parse the body, and return 
		 * {
		 * 	title:
		 *  tags : 
		 *  description:
		 * }
		 * 
		 */
		_parseResponse : function( reponse , callback ){
			
			var rtn = null
			try{
				
				var regular = new RegExp("<title>[^<]+");
				var title = regular.exec( reponse );
				regular = new RegExp(">[^<]+");
				title = regular.exec( title[0] );
				regular = new RegExp("[^>]+");
				title = regular.exec( title[0] );
				title = title[0];
				
				
				rtn =  {
					"title" : title
				}
				
			}catch( e ){
				rtn =  {
					"title" : ""
				}
			}

			callback(rtn);
			
		},
		
		_requestUrl : function( options, callback ){
			
			var hackThis = this;

			var req = http.request(options, function(res) {
				
//				console.log('STATUS: ' + res.statusCode);
//				console.log('HEADERS: ' + JSON.stringify(res.headers));
				//res.setEncoding('utf8');
				
				var data=""; 
				
				res.on('data', function (chunk) {
					data += chunk;
				});
				
				res.on('end', function () {
			        if( res.statusCode == 404 || res.statusCode == 500  ) {
			          throw new Error("HTTP Code: " + res.statusCode );
			        } else {
			          hackThis._parseResponse( data , callback );
			      
			        }
				});
				
			});

			req.on('error', function(e) {
				throw new Error(e);
			});

			// write data to request body
			req.end();
			
		}
			
	}
	
	

	/**
	 * register rhttp as a Node Module
	 */
	var rhttpNode = module.exports = {};
	
	rhttpNode.Instance = function(){
		if( rhttpNode._instance == null || rhttpNode._instance == undefined ){
			rhttpNode._instance = new rhttp();
		}
		return rhttpNode._instance;
	}