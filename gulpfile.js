'use strict';

var gulp              = require('gulp');
var del               = require('del');
//server
var connect           = require('connect');
var serveStatic       = require('serve-static');
var serveIndex        = require('serve-index');
var opn               = require('opn');
//nach Änderungen automatisch laden
var connectLivereload = require('connect-livereload');

var pipe              = require('multipipe');
var path              = require('path');

//Alle gulp-Plugins laden, die in node_modules installiert sind
var plugins           = require('gulp-load-plugins')();
var handleError = function(err) {
  console.log(err.toString());
  this.emit('end');
};

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});


gulp.task('style', function() {
  return gulp.src('app/css/**/!(*.inc).less', {base: "app"})
    .pipe(plugins.less())
    .pipe(gulp.dest('app'));
});

gulp.task('hint', function() {
  return gulp.src('app/*.js')
    .pipe(plugins.jshint()).on('error', handleError)
    .pipe(plugins.jshint.reporter('default'));
});

gulp.task('prepare', ['style', 'hint']);

gulp.task('images', function() {
  return gulp.src('app/images/**', {base: './app'})
    .pipe(plugins.newer('dist'))
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('dist'));
});

gulp.task('assets', function() {
  var assets = plugins.useref.assets();

  return gulp.src(['app/**/*.html'], {
      dot: true
    })
    .pipe(assets)
    .pipe(
      plugins.if('*.js',
        pipe(
          plugins.ngAnnotate(),
          plugins.uglify()
        )
      )
    ).on('error', handleError)
    .pipe(
      plugins.if('*.css',
        plugins.csso()
      )
    ).on('error', handleError)
    .pipe(assets.restore())
    .pipe(plugins.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['prepare', 'images', 'assets']);

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});

gulp.task('connect', function(cb) {
  var server = connect();
  server.use(connectLivereload({
    port: 35729
  }));
  server.use(serveStatic('app'));
  server.use(serveIndex('app'));

  require('http').createServer(server)
    .listen(9000)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:9000');
      cb();
    });
});

gulp.task('serve', ['connect'], function() {
  opn('http://localhost:9000');
});

gulp.task('watch', ['connect', 'serve', 'style'], function() {
  gulp.watch(['app/css/**/*.less'], ['style']);
  plugins.livereload.listen();
  gulp.watch([
    'app/**',
  ]).on('change', plugins.livereload.changed);
});
