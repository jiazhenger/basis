define(['angularAMD'],function(angularAMD){
	'use strict';
	angularAMD.factory('userIntercepted',function($q,$rootScope,$localStorage){
		return {
			request : function(config){	// 请求成功
				config.reqTime = new Date().getTime();	// 请求时间
				return config;
			},
			response : function(response){	// 响应成功
				response.config.resTime = new Date().getTime();	// 响应时间
				return response;
			},
			requestError : function(rejection){	// 请求失败
				return rejection;
			},
			responseError : function(response){	// 响应失败
				var data = response.data;
				return $q.reject(response);
			}
		}
	})
	.service('P',function($rootScope,$localStorage,$sessionStorage,$timeout,$state,$stateParams,$ajax){
		var $this = this;
		// ========================================================== 默认运行，全局方法挂载
		this.run = function(){
			$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
				if(toState.name === '/') return;
       			if(!$sessionStorage.isLogin){
       				$rootScope.promt('您还没有验证权限，请先验证权限！');
       				$timeout(function(){
       					$state.go('/');
       				},B.promtDelay)
       			}else{
       				$rootScope.isLogin = true;
       			}
       			$rootScope.obj.inswrap = false;
	        });
	        $rootScope.control = function(name){
	        	if($sessionStorage.user.perm.indexOf(name) === -1){
	        		$rootScope.promt('您还没有验证'+ name +'权限，请先验证权限！');
	   				$timeout(function(){
	   					$state.go('/');
	   				},B.promtDelay);
	   				return true;
	        	}
	        	return false;
	        }
	        // 零散变量
	        $rootScope.obj = {
	        	inswrap : false,
	        	resetEditor : false,
	        	splitEditor : $sessionStorage.splitEditor ? $sessionStorage.splitEditor : false,
	        	runJscript : false
	        }
	        
	        $rootScope.radio = {};
	        
	        $rootScope.isWrite = $sessionStorage.isWrite;
	        $rootScope.isCase = $sessionStorage.isCase;
	        
    		// ============================= 控制窗口
		 	// 默认值
			var closeDefault = {
			 	bottom : false,
			 	iframe : false,
			 	 aside : false
			}
	        
	        if($sessionStorage.isWrite){
	        	$rootScope.close = $sessionStorage.close ? $sessionStorage.close : closeDefault;
	        }else{
	        	$rootScope.close = closeDefault;
	        }
	       
	        $rootScope.$watch('close',function(newVal,oldVal){
	        	if(newVal === undefined) return;
	        	if(newVal !== oldVal){
	        		if(!A.openDetailWay){
	        			if(!$rootScope.close.aside){$rootScope.obj.inswrap = false;}
	        		}
        			$sessionStorage.close = $rootScope.close;
	        	}
	        	$rootScope.obj.resetEditor = $this.allTrue($sessionStorage.close,false);
	        },true)
	       	// ============================= 复原窗口
	       	$rootScope.resetEditor = function(){
	        	$this.setSameValue($rootScope.close,false);
	        }
	       	// ============================= 拆分窗口
	       	$rootScope.$watch('obj.splitEditor',function(newVal){$sessionStorage.splitEditor = newVal;})
	        // ============================= 权限提示
	        $rootScope.checkPerm = function(){
	        	if(!$rootScope.isWrite){$rootScope.promt();}
	        }
	        // ============================= 刷新页面,列表保持不变
	         if($sessionStorage.inswrap){
	        	$rootScope.close.aside = false;
	        }
          	// ============================= 监测详情页
	        $rootScope.$watch('obj.inswrap',function(newVal,oldVal){
	        	if(newVal != oldVal){
	        		if(!newVal){
	        			$rootScope.close.aside = false;
	        			//console.log($rootScope.radio)
	        			if(A.recovery) delete $rootScope.radio.value;	// 还原选择列表
	        		}
	        	}
	        	$sessionStorage.inswrap = newVal;
	        })
			// ============================= 详情
			$rootScope.tagsList = function($scope,$data){
				$scope.elem = {}
				$scope.$watch('radio',function(newVal,oldVal){
					if(newVal !== oldVal){
						if(!$sessionStorage.isDetail){
							$rootScope.promt('您还没有查看详细权限，请联系管理员！');
							return;
						};
						if(newVal.value){
							$rootScope.obj.inswrap = true;
						}else{
							$rootScope.obj.inswrap = false;
						}
						$rootScope.openDetailWay = A.openDetailWay;
						
						// 还原选择列表
						if($rootScope.radio.value === undefined &&  !A.openDetailWay && A.recovery){$rootScope.close.aside = false;return;}
						
						$rootScope.close.aside = A.openDetailWay ? false : true;
					}
				},true);
				$scope.tagsChange = function(key,val){
					$scope.$detail = $data.data[key];
					$scope.$tags = $data.data[key].tags[val];
					$scope.$tit = val;
					$rootScope.editorContent = {}
					$rootScope.isAttrList = false;
				}
				// ============================= 练习
		        $scope.practice = function($tags,tags,title){
		        	if(!$rootScope.isCase || !$rootScope.isWrite){
		        		$rootScope.promt();
		        		return;
		        	}
		        	if($rootScope.page === 'js' || $rootScope.page === 'es6'){
		        		$rootScope.editorModel.editor = 2;
		        		$scope.isShowNav = true;
		        	}else{
		        		$rootScope.editorModel.editor = 0; // 复原到 html 编辑模式
		        	}
		        	
		        	$scope.close.bottom = false;
		        	$scope.close.iframe = false;
		        	$rootScope.attrName = {}
					$rootScope.attrValue = {}
		        	
	        		$rootScope.isAttrList = true;
		        	
		        	var cas = $tags.cas;
		        	
		        	var replaceStr = function(searchHtml){
		        		var str = searchHtml.replace(/^[\r]/,'');
        				    str = str.replace(/[\n]+/g,'');
						    str = str.replace(/,$/g,'');
						return str;
		        	}
		        	
	        		if(angular.isString(cas) && cas !== ""){
	        			$ajax.get(B.CASE[$rootScope.page]+cas,function(data){
	        				// 搜索 html
	        				var searchHtml = /<body[\s\S]*.*>[\s\S]*(?=<\/body>)/g.exec(data);
	        				var cssStyle,script;
							if(searchHtml === null) {
								searchHtml =  data;
							}else{
								searchHtml = searchHtml.toString().replace(/^<body>*/g, "");//^<body[\s\S]*>$
							}
	        				searchHtml = replaceStr(searchHtml);
	        				// 过滤 js
							if(~searchHtml.indexOf("</script>")){
								var reg = /<script[\s\S.]*<\/script>/g;
								var script = reg.exec(searchHtml);
								if(script!==null){
									script = script.toString();
									script = script.replace(/(<script>|<\/script>|<script type='text\/javascript'>|<script type="text\/javascript">|<script type="text\/typescript">|<script type="module">)/g,'');
									script = replaceStr(script);
									searchHtml = searchHtml.replace(reg,'');
								}
							}
							
							// 搜索 css
							var styleReg = /(<style>|<style\s+type="text\/css">|<style\s+type='text\/css'>)[\s\S.]*<\/style>/g;
							var searchCss = styleReg.exec(data);
							if(searchCss!==null){
								searchCss = searchCss.toString();
								searchCss = searchCss.replace(/(<style>|<\/style>|<style type="text\/css">|<style type='text\/css'>)/g,"");
								searchCss = replaceStr(searchCss);
								//searchCss = searchCss.replace(/[\t]+/g,'');
								searchHtml = searchHtml.replace(styleReg,'');
							}
							
							$rootScope.editorContent.html = searchHtml;
	        				$rootScope.editorContent.css = searchCss;
	        				$rootScope.editorContent.js = script;
	        				$rootScope.searchCss = searchCss ?  searchCss + '\n' : '' ;
	        			});
	        		}else if(angular.isObject(cas)){
	        			
	        		}else if(cas === undefined && $rootScope.page === 'html'){
	        			var tag = '<' + tags + ' class="attr">' + $tags.def + '</' + tags + '>';
	        			$rootScope.editorContent.html = tag + '\n' + tag;
	        		}else{
	        			$rootScope.editorContent.html = "此项暂时没有案例！"
	        		}
		        }
			}
			// ============================= 属性选择
			$rootScope.attrName = {}
			$rootScope.attrValue = {}
			$rootScope.$watch('attrName',function(newVal,oldVal){
				if(newVal !== oldVal){
					angular.forEach($rootScope.attrValue,function(val,key){
						if(!newVal[key])
							if($rootScope.page === 'html'){
								$rootScope.attrValue[key] = '';
							}else if($rootScope.page === 'css'){
								delete $rootScope.attrValue[key];
							}
					})
				}
			},true);
			$rootScope.$watch('attrValue',function(newVal,oldVal){
				if(newVal != oldVal){
					if($this.dataSize(newVal) !== 0 && $rootScope.page === 'html'){ // 给 html 元素添加属性
						var $iframe = window.frames['iframe'].document;
						var $attr = $iframe.getElementsByClassName('attr');
						$rootScope.editorModel.editor = 0;
						angular.forEach(newVal,function(value,key){
							if($rootScope.attrValue[key] !== ''){
								angular.forEach($attr,function(data,i){
									$attr[i].setAttribute(key,value);
								})
							}else{
								angular.forEach($attr,function(data,i){
									$attr[i].removeAttribute(key,value);
								})
							}
						})
						var html = $iframe.body.innerHTML;
						html = html.replace(/<script[\s\S.]*script>/g,'');
						$rootScope.editorContent.html = html;
					}else if($rootScope.page === 'css'){ // 给 html 元素添加样式
						$rootScope.editorModel.editor = 1;
						if($this.dataSize(newVal) !== 0){
							var cssStyle = '';
							var css3Style = '';
							var afterStyle = {};
							var hover = '';
							var reg = /:[.\S]*/g;
							var stack = {}
							angular.forEach(newVal,function(pval,pkey){
								hover = reg.exec(pkey);
								if(pkey.indexOf('-css3-') + 1 >0){	// css3 属性
									var cKey = pkey.replace(/-css3-/g,'')
									var moz = '-moz-' + cKey + ' : ' + pval + ';\n';
									var webkit = '\t-webkit-' + cKey + ' : ' + pval + ';\n';
									var no = '\t' + cKey + ' : ' + pval + ';\n';
									css3Style += '\t' + moz + webkit + no;
								}else if(hover != null){	// 伪类写法
									if(!afterStyle[hover]){ afterStyle[hover] = []}
									var mKey = pkey.replace(reg,'');
									var css = '\t' + mKey + ' : ' + pval + ';\n'
									afterStyle[hover].push(css);
								}else{
									cssStyle += '\t' + pkey + ' : ' + pval + ';\n';
								}
							})
							
							var allStyle = '';
							if($this.dataSize(afterStyle) > 0){
								angular.forEach(afterStyle,function(styleArr,hover){
									var allCss = '';
									angular.forEach(styleArr,function(style,i){
										allCss += style;
									})
									allStyle += '.template'+ hover +'{\n' + allCss +'}\n'
								})
							}
							
							var content = (cssStyle + css3Style !== '') ? '.template{\n' + cssStyle + css3Style + '}\n' : '';
							$rootScope.editorContent.css = $rootScope.searchCss + content+ allStyle;
						}else{
							$rootScope.editorContent.css = '';
						}
					}else if($rootScope.page === 'js'){
						
					}
				}
			},true)
		}
		// ========================================================== 计算对象长度
		this.dataSize = function(obj) {
		    var size = 0, key;
		    for (key in obj) {
		        if (obj.hasOwnProperty(key)) size++;
		    }
		    return size;
		}
		// ========================================================== 判断对象是否全部为真
		this.allTrue = function(obj,a){
			var stack = true;
			angular.forEach(obj,function(data,index){
				if(data != a){
					stack = false;
				}
			})
			return stack;
		}
		// ========================================================== 将所有对象的值都设为同一个值
		this.setSameValue = function(obj,val){
			for(var i in obj){
				obj[i] = val;
			}
		}
		return this;
	})
})