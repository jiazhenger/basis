// ============================================== 主函数入口文件，加载应用程序，启动 angular,	// 主入口文件必须是  require 形式
if(navigator.userAgent.toLowerCase().indexOf('applewebkit/') === -1){
	document.write('<div class="brower-promt">温馨提示：请使用webkit内核浏览器浏览<br>（如：<span>google,opera,safari,360,qq</span> 等）<br>以获取最优展示效果</div>');
}else{
	require(['app/common/main','app/module/frontEnd/app'],function(){
		'use strict';
	})
}

