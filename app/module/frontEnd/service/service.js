define(['angularAMD'],function(angularAMD){
	'use strict';
	angularAMD.service('service',function(){
		this.method = function(){
			
		}
		
		this.run = function(){
			
		}
		
		return this;
	})
	
	angularAMD.factory('factory',function(){
		return {
			a : function(){
				
			},
			b : function(){
				
			}
		}
	})
)}