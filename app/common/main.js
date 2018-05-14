// ============================================== 公共函数模块，加载应用程序，启动angular
define(function(){
	'use strict';
	// ============================================== 公共变量
	window.A = {
		openDetailWay : 0,	// 列表与详情窗口打开方式,0 只显示一个，1 显示两个
		recovery : 1,		// 列表可再次点击，
		jsLib : ['lib/jquery-1.12.3'],	// 需要加载的 js 库
		es6Lib : ['es6/traceur','es6/BrowserSystem','es6/bootstrap']
	}
})