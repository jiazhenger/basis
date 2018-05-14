//  ajax get与post请求
define(['angularAMD'],function(angularAMD){
	'use strict';
	
	angularAMD.service('$ajax',function($http,$timeout,$localStorage,$rootScope,$q){
		
		this.get = function(url,callback){
			var deferred = $q.defer();  // 声明延后执行，即声明请求异步
			var promise = deferred.promise;
			$http.get(url).success(function(data){
				deferred.resolve(data);
			});
			return promise.then(function(data){
				//console.log(data);
				callback && callback(data);
				return data;
			})
		}
		
		this.getTxt = function(url){
			var deferred = $q.defer();  // 声明延后执行，即声明请求异步
			var promise = deferred.promise;
			$http({
				 method : 'GET'
			}).success(function(data){
				deferred.resolve(data);
			});
			return promise.then(function(data){
				//console.log(data);
				return data;
			})
		}
		return this;
	})
})