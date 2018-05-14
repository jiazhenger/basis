define(['angularAMD'],function(angularAMD){
	'use strict';
  	// ================================================== iframe 编辑代码
  	angularAMD.directive('editor',function($rootScope,$sessionStorage,$timeout,P){
  		return {
  			restrict : 'A',
  			link : function(scope,elem,attr){
  				if(!$sessionStorage.isWrite) return;
  				elem.ready(function(){
  					var $iframe = document.getElementById(attr.editor);
  					$rootScope.iframe = $iframe;
  					
		  			scope.doc = $iframe.contentDocument || window.frames['iframe'];
		  			
		  			
		  			var jslib = A.jsLib;
		  			var jsScript = '';
		  			var jsType = 'text/javascript';
		  			if($rootScope.page === 'es6'){
		  				jslib = A.es6Lib;
		  				jsType = 'module';
		  			}else if($rootScope.page === 'angular2'){
		  				jslib = A.ng2Lib;
		  				jsType = 'text/typescript';
		  			}
		  			
		  			for(var i in jslib){
		  				jsScript += '<script src="public/js/'+ jslib[i] +'.js"></script>';
		  			}
		  			
		  			$rootScope.writeHtml = function(innerHTML,style,script){
		  				var style = style || '';
		  				var innerHTML = innerHTML || '<div style="color:#999;font-size:16px">编辑效果显示区</div>';
	  				    if($rootScope.page === 'angular2'){
	  				    	innerHTML = '<my-app>angular2 application</my-app>';
	  				    }
		  				var script = script || '';
		  				var html = '<!DOCTYPE html><html>\n<head>\n'+
								'<meta charset="utf-8">\n' +
								'<title>正文编辑区</title>\n' +
								'<link rel="stylesheet" href="public/css/reset.css">\n' +  jsScript +
								'<style>'+ style +'</style>\n' +
								'</head><body>' + innerHTML + '<script type='+ jsType +'>'+ script +'</script></body></html>';
						scope.doc.open();
						scope.doc.write('');
						scope.doc.close();
						
						scope.doc.open();
						scope.doc.write(html);
						scope.doc.close();
		  			}
		  			
		  			$rootScope.editorContent = {}
					$rootScope.clear = {}
					 
					scope.$watch('editorContent',function(newVal,oldVal){
						if(P.dataSize(newVal) === 0 || newVal.html === '' && newVal.css === '' && newVal.js === ''){
							$rootScope.writeHtml();
							$rootScope.clear = {
								 all : true,
								html : true,
								 css : true,
								  js : true
							}
							return;
						}
						
						if(newVal.html === '' && newVal.css === '' && newVal.js === ''){
							$rootScope.clear.all = true;
						}else{
							$rootScope.clear.all = false;
						}
						
						if(newVal !== oldVal){
							$rootScope.writeHtml($rootScope.editorContent.html,$rootScope.editorContent.css);
							//$rootScope.clear.all = false;
							angular.forEach($rootScope.clear,function(data,key){
								if(key !== 'all'){
									$rootScope.clear[key] = $rootScope.editorContent[key] === '' || $rootScope.editorContent[key] === undefined ? true : false;
								}
							})
						}
					},true);
					
					scope.$watch('clear',function(newVal,oldVal){
						if(P.dataSize(newVal) === 0) return;
						
						if($rootScope.clear.all){$rootScope.editorContent = {}}
						angular.forEach($rootScope.clear,function(data,key){
							if(key !== 'all'){
								if($rootScope.clear[key]){
									$rootScope.editorContent[key] = ''; 
								}
							}
						})
					},true);
					
					scope.$watch('obj.runJscript',function(newVal,oldVal){
						if(newVal !== oldVal){
							if(newVal){
								$rootScope.writeHtml($rootScope.editorContent.html,$rootScope.editorContent.css,$rootScope.editorContent.js);
							}
							$timeout(function(){$rootScope.obj.runJscript = false},2000)
						}
					})
				})
  			},
	  		controller : function($scope,$rootScope){
	  			 // 编辑器切换
		        $rootScope.editorModel = {
		        	editor : 0
		        }
		        /*
		        $scope.$watch('editorModel.editor',function(newVal,oldVal){
		        	if(newVal !== oldVal){
		        		
		        	}
		        },true);*/
	  		}
	  	}
  	});
})