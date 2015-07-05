var XHRM = {
	counter	: 0,
	log : {},
	init: function () {
		if(typeof XMLHttpRequest != "undefined") {
			this.xhrattach(XMLHttpRequest.prototype.open);
		}
	},
	xhrattach: function (open) {
		
		XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
			//console.info("prototype.open here");
			XHRM.counter++;
			//console.info("xhr counter: " + XHRM.counter);
			if(typeof this.addEventListener == "function") {
				try {
		    		this.tempMetrics = XHRM.log;
		    		this.tempMetrics[XHRM.counter] = {
		    				'url': "", 
		    				'method': "", 
		    				'async': "", 
		    				'start': 0, 
		    				'connect': 0, 
		    				'received': 0, 
		    				'processing': 0, 
		    				'ready': 0, 
		    				'total': 0, 
		    				'status': "", 
		    				'text': "", 
		    				'size': 0,
		    				'complete': false
		    				};

			    	this.tempMetrics[XHRM.counter]['url'] = url;
			    	this.tempMetrics[XHRM.counter]['method'] = method;
			    	this.tempMetrics[XHRM.counter]['async'] = async;
			    	this.tempMetrics[XHRM.counter]['start'] = new Date().getTime();;
		    		//console.info("trying to attach event...");

		    		this.addEventListener("readystatechange", function () {
			    		//console.info("tracer here");
			    		switch(this.readyState)
			        	{
			        		case 0:
			        			// this never get called
			        			this.tempMetrics[XHRM.counter]['start'] = new Date().getTime();
			        			break;
			            	case 1:
			           			this.tempMetrics[XHRM.counter]['connect'] = new Date().getTime();
			            		break;
			            	case 2:
			           			this.tempMetrics[XHRM.counter]['received'] = new Date().getTime();
			            		break;
			            	case 3:
			           			this.tempMetrics[XHRM.counter]['processing'] = new Date().getTime();
			            		break;
			            	case 4:
			            		this.tempMetrics[XHRM.counter]['ready'] = new Date().getTime();
			            		this.tempMetrics[XHRM.counter]['status'] = this.status;
			            		this.tempMetrics[XHRM.counter]['text'] = this.statusText;
			            		this.tempMetrics[XHRM.counter]['size'] = this.responseText.toString().length;
			            		this.tempMetrics[XHRM.counter]['total'] = this.tempMetrics[XHRM.counter]['ready'] - this.tempMetrics[XHRM.counter]['start'];
			            		this.tempMetrics[XHRM.counter]['complete'] = true;
			            		break;
			        	}
			        	
			    	}, false);
					//console.info("stopped");
				}
	        	catch(err) {
	        	    document.getElementById("errors").innerHTML = err.message;
	        	}
	        }

	    	return open.apply(this, [method, url, async, user, pass]);
	    };
	
	
	}
};