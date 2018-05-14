// ============================================== 配置依赖
require.config({
	paths: {
			       angular : 'public/js/angular/angular',
			    angularAMD : 'public/js/angular/angularAMD',
			  angularRoute : 'public/js/angular/angular-ui-router',
			angularAnimate : 'public/js/angular/angular-animate',
			     ngStorage : 'public/js/angular/ngStorage',
			    ngSanitize : 'public/js/angular/angular-sanitize'
	},
	// 可以为旧的，传统的浏览器没有使用 define()声明依赖和定义模块的，配置依赖关系，导出和自定义初始化
	shim: {
		           angular : {'exports' : 'angular'},
		        angularAMD : ['angular'],
		      angularRoute : ['angular'],
	  	    angularAnimate : ['angular'],
		      angularSwipe : ['angular'],
		         ngStorage : ['angular'],
		        ngSanitize : ['angular']
	}
})
// ============================================== 加载依赖公共模块
define([
	// =============================== 库模块
	'angular',
	'angularAMD',
	'angularRoute',
	'angularAnimate',
	'ngStorage',
	'ngSanitize',
	// =============================== 自定义公共服务模块
	'app/common/service/interceptorService',
	'app/common/service/ajaxService',
	// =============================== 自定义公共指令模块
	'app/common/directive/publicDirective'
	// =============================== dom 指令模块
	// =============================== 非 angular扩展插件
	//'public/js/pc.js'
],function(angular,angularAMD){
	'use strict';
	window.USER = [
						{name : 'j+2',pwd : '123456',perm:['html','css','css3','javascript','es6'],isWrite:1,isDetail:1,isCase:1},
						{name : '游客',pwd : '123456',perm:['html','css','css3','javascript'],isWrite:1,isDetail:1,isCase:0},
						{name : 'html',pwd : 'html862',perm:['html'],isWrite:1,isDetail:1,isCase:1},
						{name : 'css',pwd : 'css369',perm:['css'],isWrite:1,isDetail:1,isCase:1},
						{name : 'css3',pwd : 'css392',perm:['css3'],isWrite:1,isDetail:1,isCase:1},
						{name : 'js',pwd : 'js638',perm:['javascript'],isWrite:1,isDetail:1,isCase:1}
				  ]
	window.B = {
		API : {
			html : 'api/html.json',
			 css : 'api/css.json',
			css3 : 'api/css3.json',
			  js : 'api/js.json',
			 es6 : 'api/es6.json'
		},
		CASE : {
			html : 'case/html/',
			 css : 'case/css/',
			  js : 'case/js/',
			 es6 : 'case/es6/'
		},
		page : {
			      html : false,
			       css : false,
			      css3 : false,
			javascript : false,
			 	   es6 : false
			
		},
		promtDelay : 1500
	}
	// =============================== 加载公共库模块
	angularAMD.modules = [
		'ui.router',
		'ngAnimate',
		'ngStorage',
		'ngSanitize'
	]
	// ============================================== angular 启动器
	window.APP = function(angularAMD,priviteMoule,callback){
		if(priviteMoule && priviteMoule.length > 0){
			angular.forEach(priviteMoule,function(data){angularAMD.modules.push(data);})	// 合并私有及公有模块
		}
		
		var app = angular.module('front-end', angularAMD.modules);	// angularAmd 此处可随意命名
		
		app.config(function ($stateProvider,$urlRouterProvider,$httpProvider){
			callback($stateProvider,$urlRouterProvider);
		}).run(function(P){ 
			P.run() 
		});
		
		return angularAMD.bootstrap(app);	// angularAMD启动 angular
		//return app
	}
	return angularAMD;
});
