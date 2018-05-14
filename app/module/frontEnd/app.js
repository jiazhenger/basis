// ============================================== 路由分配器
define(['app/common/common','app/module/frontEnd/common'], function(angularAMD,privateModule){
	'use strict';
	window.APP(angularAMD,privateModule,function($stateProvider,$urlRouterProvider){
		$stateProvider.state('/',{
			url: '/',
			templateUrl: 'view/index.html',
			controller : function($scope,$rootScope,$state,$sessionStorage,$data){
				// 权限提示
				$scope.goStudy = function(key,val){
					if(!val){
						$rootScope.promt('您还没有 ' + key + ' 模块权限，请联系管理员！');
					}else{
						$state.go(key)
					}
				}
				// ===================== 如果有缓存
				var saveData = $sessionStorage.data;
				var saveUser = $sessionStorage.user;
				//console.log($sessionStorage)
				//$sessionStorage.$reset();
				
				if(saveData){
					$scope.nav = saveData;
					$scope.isSuccess = true;
					$scope.sTxt = '正在学习中......';
					$scope.user = {name:saveUser.name,pwd:saveUser.pwd}
					return;
				}
				// ===================== 如果没有缓存
				$scope.nav = $data;
				$scope.user = {};
				
				$scope.user.name="j+2";
				$scope.user.pwd="123456";
				
				$scope.submitForm = function($valid){
					var name = $scope.user.name;
					var pwd = $scope.user.pwd;
					
					if(!$valid){
						if(name === '' || name === undefined){$rootScope.promt('用户名不能为空！');return;}
						if(pwd === '' || pwd === undefined){$rootScope.promt('密码不能为空！');return;}
					}
					
					angular.forEach(USER,function(data,index){
						if(name === data.name && pwd === data.pwd){
							var perm = data.perm;
							for(var i in perm){
								$data[perm[i]] = true;
							}
							
							$scope.nav = $data;
							$scope.isSuccess = true;
							$sessionStorage.data = $data;
							$sessionStorage.user = {name:name,pwd:pwd,perm:perm};
							$sessionStorage.isLogin = true;
							$scope.sTxt = '正在学习中......';
							$rootScope.promt('恭喜您通过验证，可以开始学习了！');
							
							// 编辑权限
							if(data.isWrite){
								 $sessionStorage.isWrite = 1;
								 $rootScope.isWrite = 1;
							}
							// 案例权限
							if(data.isCase){
								$sessionStorage.isCase = 1;
								$rootScope.isCase = 1;
							}
							// 查看详情权限
							if(data.isDetail){
								$sessionStorage.isDetail = 1;
							}
						}
					})
					
					if(!$scope.isSuccess){
						$rootScope.promt('密码或用户名错误，或者管理员还未给你配置权限！');
					}
				}
			},
			resolve : {
				$data : function(){return B.page;}
			},
			onEnter : function(){}
		})
		// ============================================== html　
		.state('html',{
			url: '/html',
			templateUrl: 'view/common/frame.html',
			controller : function($scope,$rootScope,$data){
				if($rootScope.control('html')){return;}
				$rootScope.page = 'html';
				$scope.title = $data.title;
				$scope.data = $data.data;
				$rootScope.tagsList($scope,$data);
			},
			resolve : {
				$data : function($ajax){
					return $ajax.get(B.API.html);;
				}
			}
		})
		// ============================================== css　
		.state('css',{
			url: '/css',
			templateUrl: 'view/common/frame.html',
			controller : function($scope,$rootScope,$data){
				if($rootScope.control('css')){return;}
				$rootScope.page = 'css';
				$scope.title = $data.title;
				$scope.data = $data.data;
				$rootScope.tagsList($scope,$data);
			},
			resolve : {
				$data : function($ajax){
					return $ajax.get(B.API.css);
				}
			}
		})
		// ============================================== css3　
		.state('css3',{
			url: '/css3',
			templateUrl: 'view/common/frame.html',
			controller : function($scope,$rootScope,$data){
				if($rootScope.control('css3')){return;}
				$rootScope.page = 'css';
				$scope.title = $data.title;
				$scope.data = $data.data;
				$rootScope.tagsList($scope,$data);
			},
			resolve : {
				$data : function($ajax){
					return $ajax.get(B.API.css3);
				}
			}
		})
		// ============================================== javascript　
		.state('javascript',{
			url: '/js',
			templateUrl: 'view/common/frame.html',
			controller : function($scope,$rootScope,$data){
				if($rootScope.control('javascript')){return;}
				$rootScope.page = 'js';
				$scope.title = $data.title;
				$scope.data = $data.data;
				$rootScope.tagsList($scope,$data);
			},
			resolve : {
				$data : function($ajax){
					return $ajax.get(B.API.js);
				}
			}
		})
		// ============================================== es6　
		.state('es6',{
			url: '/es6',
			templateUrl: 'view/common/frame.html',
			controller : function($scope,$rootScope,$data){
				if($rootScope.control('javascript')){return;}
				$rootScope.page = 'es6';
				$scope.title = $data.title;
				$scope.data = $data.data;
				$rootScope.tagsList($scope,$data);
			},
			resolve : {
				$data : function($ajax){
					return $ajax.get(B.API.es6);
				}
			}
		})
		// ============================================== es6　
		.state('angular2',{
			url: '/angular2',
			templateUrl: 'view/common/frame.html',
			controller : function($scope,$rootScope,$data){
				if($rootScope.control('javascript')){return;}
				$rootScope.page = 'angular2';
				$scope.title = $data.title;
				$scope.data = $data.data;
				$rootScope.tagsList($scope,$data);
			},
			resolve : {
				$data : function($ajax){
					return $ajax.get(B.API.ng2);
				}
			}
		})
		$urlRouterProvider.otherwise('/');
	})
})
