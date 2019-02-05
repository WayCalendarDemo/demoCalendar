var gulp      = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var	cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
	'scss':'./scss/',
	'css':'./doc_root/shared/css',
	'js':'./doc_root/shared/js'
}


/*
 * scssファイルのコンパイル・ベンダープリフィクスの付与・ミニファイ
 * 【注意】本番アップの前にソースマップを削除してください。
 */

gulp.task('scss', function(){
    gulp.src( [
        paths.scss + '*.scss',
    ])
	//.pipe(sourcemaps.init())
	.pipe(plumber())
	.pipe(sass())
	.pipe(autoprefixer('last 2 version'))
	.pipe(cssmin())
	.pipe(rename({suffix:'.min'}))
	//.pipe(sourcemaps.write('/map/'))
	.pipe(gulp.dest(paths.css));
});

//scssコンパイルの自動化
gulp.task('watch',['scss'],function(){
	var scssWatcher = gulp.watch(paths.scss + '**/*.scss',['scss']);
	scssWatcher.on('change',function(event){
	});
});

gulp.task('default', function() {
	gulp.run('scss');
});
