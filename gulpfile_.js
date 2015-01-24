'use strict';

var SERVER_PORT = 9000;

var gulp = require('gulp');

var del = require('del');

var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var connect = require('connect');
var connectLivereload = require('connect-livereload');
var gulpLivereload = require('gulp-livereload');
var opn = require('opn');

var gulpIf = require('gulp-if');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var useref = require('gulp-useref');

gulp.task('clean', function(cb) {
	del(['dist'], cb);
});

gulp.task('build', function() {
	var assets = useref.assets();

	return gulp.src(['app/**/*.html'], {dot: true})
		.pipe(assets)
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', csso()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function() {
	gulp.start('build');
});

gulp.task('connect', function(cb) {
	var server = connect();
	server.use(connectLivereload({port: 35729}));
	server.use(serveStatic('app'));
	server.use(serveIndex('app'));

	require('http').createServer(server)
		.listen(SERVER_PORT)
		.on('listening', function() {
			console.log('Started connect web server on http://localhost:'+SERVER_PORT);
			cb();
		});
});

gulp.task('serve', ['connect'], function() {
	opn('http://localhost:'+SERVER_PORT);
});

gulp.task('watch', ['connect', 'serve'], function () {
	gulpLivereload.listen();
	gulp.watch([
		'app/**',
	]).on('change', gulpLivereload.changed);
});
