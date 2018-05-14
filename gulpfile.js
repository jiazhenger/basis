// ============================================================================================  引入模块
var       gulp = require('gulp'), 					// 本地安装gulp所用到的地方

	sourcemaps = require('gulp-sourcemaps'),		// 
	    notify = require('gulp-notify'),			// 异常处理：处理出现异常并不终止watch事件
       plumber = require('gulp-plumber'),			// 异常处理：提示出现了错误
	    rename = require('gulp-rename'),			// 重命名

	   //plugins = require('gulp-load-plugins')({ camelize: true }),
	   
          less = require('gulp-less'),		 		// 编译 less
		  
		  sass = require('gulp-ruby-sass'),			// 编译 sass
  autoprefixer = require('gulp-autoprefixer'),		// 根据设置浏览器版本自动处理浏览器前缀
		  
	   htmlmin = require('gulp-htmlmin'),			// 压缩 html
	    
	  //cssmin = require('gulp-minify-css'),		// 压缩 css
	    cssmin = require('gulp-clean-css'),			// 压缩 css
		
		uglify = require('gulp-uglify'),			// 压缩 js
		jshint = require('gulp-jshint'),			// 检测 js
		concat = require('gulp-concat'),			// 合并 js
		
	  imagemin = require('gulp-imagemin'),			// 压缩 img
	  pngcrush = require('imagemin-pngcrush'),		//
	  
   amdOptimize = require("amd-optimize"),			// 文件名命名，将 gulp 与 require 集成
   
   		   rjs = require('rjs'),					// 合并 requireJS
   		   
   		   umd = require('gulp-umd'),				// 将 js 转换成  require 模式
   
	livereload = require('gulp-livereload'),		// 实时保存刷新，不用按F5和切换界面了
	   changed = require('gulp-changed');			//
	
// ============================================================================================  参数配置
var srcPath = '';
var destPath = '../lesson/';
var param = {
	html : {
		 src : srcPath + '**/*.{html,htm}',
		dest : destPath,
	   watch : srcPath + ''
	},
	less : {
		 src : srcPath + 'public/less/*.less',
		dest : srcPath + 'public/css',
	   watch : srcPath + 'public/less/**'
	},
	sass : {
		 src : srcPath + 'public/sass/*.{sass,scss}',
		dest : destPath + 'css',
	   watch : srcPath + 'public/sass/**'
	},
	css : {
		 src : srcPath + 'public/css/*.css',
		dest : destPath + 'public/css',
	   watch : srcPath + 'public/css/**',
	  concat : destPath + 'main.css'
	},
	js : {
		 src : srcPath + 'app/module/goods/app.js',
		dest : destPath + 'public/js',
	   watch :  srcPath + 'public/js/**',
	  concat : 'all.js'
	},
	rjs : {
		 src : srcPath + 'app/**/*.js',
		dest : destPath + 'app',
	   watch : null,
	  concat : 'main.js',
	    main : srcPath + 'app/module/index/main',
	  config : {
			paths: {									
					   angular : 'public/js/angular/angular',
				  angularRoute : 'public/js/angular/angular-ui-router',
				angularAnimate : 'public/js/angular/angular-animate',
					angularAMD : 'public/js/angular/angularAMD',
					 ngStorage : 'public/js/angular/ngStorage',
					ngSanitize : 'public/js/angular/angular-sanitize'
			},
			shim: {
					 'angular' : {'exports' : 'angular'},
				'angularRoute' : ['angular'],
			  'angularAnimate' : ['angular'],
				  'angularAMD' : ['angular'],
				   'ngStorage' : ['angular'],
				  'ngSanitize' : ['angular']
			}
		}
	},
	img : {
		 src : srcPath + 'public/images/**/*.{jpg,png,gif}',
		dest : destPath + 'public/images',
	   watch : srcPath + ''
	}
}
// ============================================================================================ 压缩 html
gulp.task('html', function() {
  return gulp.src(param.html.src)
    .pipe(htmlmin({
		collapseWhitespace: true,
		removeComments: true,
		collapseBooleanAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		minifyJS: true,
		minifyCSS: true
	}))
    //.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //.pipe(notify({message: 'html 压缩成功'}))
	.pipe(gulp.dest(param.html.dest))
});
// ============================================================================================ 编译 less
gulp.task('less',function(){
    gulp.src(param.less.src)						// 选择编译文件，传入参数是文件路径
	    .pipe(less()) 								// 该任务调用的模块
		.pipe(cssmin({compatibility: 'ie7',processImport: false,keepBreaks: true}))
        //.pipe(sourcemaps(sourcemaps.write()))
		//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		//.pipe(rename({suffix:".min"}))
		//.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		//.pipe(notify({message:'less 编译成功'}))
		.pipe(gulp.dest(param.less.dest)) 			// 输出文件
});
// ============================================================================================ 编译 sass
gulp.task('sass',function(){
    gulp.src(param.sass.src)
    	.pipe(sourcemaps.init())
	    .pipe(sass({style:'compressed'}))	// style: nested | expanded | compact(不换行) | compressed | 一行
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		//.pipe(rename({suffix:".min"}))
		//.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		//.pipe(notify({message:'less 编译成功'}))
		.pipe(gulp.dest(param.sass.dest))
});
// ============================================================================================ 压缩 css
gulp.task('css',function(){
	gulp.src(param.css.src)
		//.pipe(concat(param.css.concat))
		.pipe(cssmin({compatibility: 'ie7',processImport: false,keepBreaks: false}))
		//.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		//.pipe(rename({suffix:".min"}))
		//.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		//.pipe(notify({message:'css 压缩成功'}))
		.pipe(gulp.dest(param.css.dest))
})
// ============================================================================================ js操作 
// ============================================== 检查 js
gulp.task('jshint', function() {
  return gulp.src(param.js.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default',{verbose:true}))
	.pipe(jshint.reporter('fail'))
    //.pipe(notify({message:'js 格式检查完毕'}));
});
// ============================================== 压缩 js
gulp.task('js',function(){
	gulp.src(param.js.src)
		.pipe(uglify())
		.pipe(rename({suffix:".min"}))
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(notify({message:'js 压缩成功'}))
		.pipe(gulp.dest(param.js.dest))
})
// ============================================== 压缩、合并 js
gulp.task('jsc',function(){
	gulp.src(param.js.src)
		.pipe(concat(param.js.concat))
		.pipe(uglify())
		.pipe(rename({suffix:".min"}))
		//.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		//.pipe(notify({message:'js 合并成功'}))
		.pipe(gulp.dest(param.js.dest))
})
// ============================================== 压缩、合并 requireJS
/*
gulp.task('rjs',function(){
	gulp.src(param.rjs.src)
		.pipe(amdOptimize(param.rjs.main,param.rjs.config))
		.pipe(concat(param.rjs.concat))
		//.pipe(uglify())
		.pipe(rename({suffix:".min"}))
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(notify({message:'requireJS 合并成功'}))
		.pipe(gulp.dest(param.rjs.dest))
})*/
rjs.gulp(gulp,amdOptimize,concat,uglify,rename,plumber,notify);
gulp.task('rjs',function(){
	gulp.start('frontEnd');
})
// ============================================================================================ 压缩图片
gulp.task('img', function() {
	gulp.src(param.img.src)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngcrush()]
		}))
		//.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		//.pipe(notify({message: 'img 压缩成功'}))
		.pipe(gulp.dest(param.img.dest))
})
// ============================================================================================ 监听事件（自动编译文件）
gulp.task('watch', function () {
	
	gulp.watch(param.html.watch || param.html.src, ['html']);	// html
    gulp.watch(param.less.watch || param.less.src, ['less']);	// less
    gulp.watch(param.css.watch || param.css.src, ['css']);		// css
    gulp.watch(param.img.watch || param.img.src, ['img']);		// img
	
	//gulp.watch(param.js.watch || param.js.src, ['jshint','js']); // js
	
	//gulp.watch(param.rjs.watch || param.rjs.src, ['jshint','rjs']);
	rjs.watch(gulp);	// 监测 requireJS
	
	// 实时保存刷新，不用按F5和切换界面了
	livereload.listen();
    gulp.watch(srcPath + '**/*.html',function(file){livereload.changed(file.path);});
    gulp.watch(srcPath + 'css/*.css',function(file){livereload.changed(file.path);});
    gulp.watch(srcPath + '**/*.js',function(file){livereload.changed(file.path);});
}).on('change', function(event) {		// 使用change事件来同步删除情况
	if(event.type==deleted){			// 对应处理删除情况
		
	}
	console.log('文件 ' + event.path + ' 是 ' + event.type + ', 任何正在进行');
	//console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});;
// ============================================================================================  定义默认任务，gulp 启动
gulp.task('default',['watch']);
// ============================================================================================  生成发布版本
gulp.task('publish',function(){
	gulp.start('html','css','img','frontEnd')
});
/*
gulp.task('default', function(){
	gulp.run('less','html','css','js','jshint','img');
	
	// 监听html文件变化
	gulp.watch(param.less.src, function(){gulp.run('less');});
	
	// 监听html文件变化
	gulp.watch(param.html.src, function(){gulp.run('html');});

	// Watch .css files
	gulp.watch(param.css.src, ['css']);

	// Watch .js files
	gulp.watch(param.js.src, ['jshint', 'js']);

	// Watch image files
	gulp.watch(param.img.src, ['img']);
});*/
// ============================================================================================ gulp API
// gulp.task(['less','sass'], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
// gulp.src(['less/main.less','sass/main.scss']) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
// gulp.dest(['css','css']) 处理完后文件生成路径