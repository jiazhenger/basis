// ============================================================ 公共模块指令  ============================================================
define(['angularAMD'],function(angularAMD){
	'use strict';
	// ================================================== 提示
	angularAMD.directive('promt',function($timeout,$rootScope){
		return {
			restrict : 'E',
			replace : true,
			template : '<div class="promt" ng-show="promtFlag" ng-class="{current:promtFlag}"><span ng-bind="promtText"></span></div>',
			link : function(scope,elem,attr){
				$rootScope.promt = function(txt){
					scope.promtText = txt || '您还没有使用此功能的权限，请联系管理员！';
					scope.promtFlag = true;
					$timeout(function(){
						scope.promtFlag = false;
					},B.promtDelay);
				}
			}
		}
	})

})