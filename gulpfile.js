
var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	mincss = require('gulp-minify-css'),
	minhtml = require('gulp-minify-html'),
	replaceHtml = require('gulp-html-replace'),
	concat = require('gulp-concat'),
	getFiles = require('gulp-dom-src'),
	clean = require('gulp-clean'),
	runSequence = require('run-sequence');

gulp.task('clean-and-compile', function(cb)
{
	var concurrent = ['copy-images', 'copy-fonts-1', 'copy-fonts-2', 'concat-minify-js', 'concat-minify-css'];
	runSequence('clean-dist', concurrent, 'use-min-in-html', cb);
});

gulp.task('copy-images', function()
{
	return gulp.src('./src/resources/img/**').pipe(gulp.dest('./compiled/resources/img'));
});

gulp.task('copy-fonts-1', function()
{
	return gulp.src('./src/resources/fonts/**').pipe(gulp.dest('./compiled/resources/fonts'));
});

gulp.task('copy-fonts-2', function()
{
	return gulp.src('./src/resources/lib/fonts/**').pipe(gulp.dest('./compiled/resources/fonts'));
});

gulp.task('concat-minify-js', function()
{
	return getFiles({file: './src/index.html', selector: 'script[data-minify-me]', attribute: 'src'})
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./compiled/resources/js'));
});

gulp.task('concat-minify-css', function()
{
	return getFiles({file: './src/index.html', selector: 'link[rel="stylesheet"]', attribute: 'href'})
		.pipe(concat('styles.min.css'))
		.pipe(mincss())
		.pipe(gulp.dest('./compiled/resources/css'));
});

gulp.task('use-min-in-html', function()
{
	return gulp.src('./src/index.html')
		.pipe(replaceHtml({js: 'resources/js/scripts.min.js', css: 'resources/css/styles.min.css'}))
		.pipe(minhtml({spare: true, empty: true}))
		.pipe(gulp.dest('./compiled'));
});

gulp.task('clean-dist', function()
{
	return gulp.src('./compiled', {read: false}).pipe(clean());
});

gulp.task('default', ['clean-and-compile']);