'use strict';

var PORT = 9000;

// Node internals
var fs                = require('fs');

// Helpers
var del               = require('del');
var connect           = require('connect');
var serveStatic       = require('serve-static');
var serveIndex        = require('serve-index');
var opn               = require('opn');
var connectLivereload = require('connect-livereload');
var nib               = require('nib');
var pipe              = require('multipipe');
var browserify        = require('browserify');// für vCard Export

// Gulp-internals
var transform         = require('vinyl-transform');// für vCard Export
var map               = require('vinyl-map');
var File              = require('vinyl');
var through           = require('through2');
var gulp              = require('gulp');

// All plugins (modules whose name start with “gulp-”)
var plugins           = require('gulp-load-plugins')();// für vCard Export

// Information about our app
var app               = require('./package.json');

var VERSION = parseInt(app.version, 10);

// Define our own browserify plugin
plugins.browserify    = transform(function(fileName) {// für vCard Export
  return browserify({entries: fileName}).bundle();
});

// Define our own manifest plugin
plugins.manifest      = function(fileName) {
  // This holds the content of out manifest
  var manifest = ['CACHE MANIFEST'];
  var html = through.obj(function eachHTML(file, enc, cb) {
    var html = file.contents.toString();
    // Write the manifest’s location to the <html> tag
    file.contents = new Buffer(html.replace(/<html([^>]*)>/, '<html$1 manifest="'+fileName+'">'), 'utf8');
    this.push(file);
    manifest.push(file.relative);
    cb();
  });
  var assets = through.obj(function eachAsset(file, enc, cb) {
    this.push(file);
    // add the path of the asset to the manifest
    manifest.push(file.relative);
    cb();
  }, function flush(cb) {
    // Push the manifest file itself into the gulp stream (along with the other assets)
    this.push(new File({
      cwd: '/',
      base: '/',
      path: '/'+fileName,
      contents: new Buffer(manifest.join('\n') + '\n', 'utf8')
    }));
    cb();
  });
  return {
    html: html,
    assets: assets
  };
};

var handleError = function(err) {
  console.log(err.toString());
  this.emit('end');
};

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('style', function() {
  return gulp.src('app/**/*.styl')
    .pipe(plugins.stylus({
      use: [
        nib()
      ]
    })).on('error', handleError)
    .pipe(gulp.dest('app'));
});

gulp.task('lib', function() { // für vCard Export
  gulp.src('browserify.js')
  .pipe(plugins.browserify)
  .pipe(gulp.dest('app/js'));
});

// TODO: replace font path in css

// exclude browserify
gulp.task('hint', function() {
  return gulp.src(['app/js/*.js', '!app/js/browserify.js']) // für vCard Export
    .pipe(plugins.jshint()).on('error', handleError)
    .pipe(plugins.jshint.reporter('default'));
});

gulp.task('prepare', ['style', 'hint', 'lib']);

gulp.task('images', function() {
  return gulp.src('app/images/**', {
      base: './app'
    })
      .pipe(plugins.imagemin())
      .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
  return gulp.src(['app/bower_components/bootstrap/fonts/*', 'app/fonts/*'])
    .pipe(gulp.dest('dist/'+VERSION+'/fonts'));
});

gulp.task('assets', function() {
  var assets = plugins.useref.assets();
  return gulp.src(['app/**/*.html', '!app/js/**/*.html'])
    .pipe(map(function(code, filename) {
      return code.toString().replace(/\bASSET_VERSION\b/g, VERSION);
    }))
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
    // Pass all assets to the appcache manifest
    .pipe(assets.restore())
    .pipe(plugins.useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('manifest', function() {
  var manifest = plugins.manifest(app.name+'.appcache');
  return gulp.src(['dist/*.html', 'dist/'+VERSION+'/**/*'], {
    base: './dist',
    nodir: true
  })
  .pipe(plugins.if('*.html',
    manifest.html,
    manifest.assets
  ))
  .pipe(gulp.dest('dist'));
});

gulp.task('version', function(cb) {
	var next = VERSION+1;
	console.log('Jumping from', VERSION, 'to', next);
  VERSION = next;
  app.version = ''+VERSION+'.0.0';
  fs.writeFile('./package.json', JSON.stringify(app, null, 2), cb);
});

gulp.task('build', ['prepare', 'images', 'fonts', 'assets'], function() {
  gulp.start('manifest');
});

gulp.task('full-build', ['version', 'clean'], function() {
  gulp.start('build');
});

gulp.task('cordova', function() {
  return gulp.src('dist/**')
  .pipe(gulp.dest('../www'));
});

gulp.task('default', ['full-build']);

gulp.task('connect', function(cb) {
  var server = connect();
  server.use(connectLivereload({
    port: 35729
  }));
  server.use(serveStatic('app'));
  server.use(serveIndex('app'));

  require('http').createServer(server)
    .listen(PORT)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:'+PORT);
      cb();
    });
});

gulp.task('serve', ['connect'], function() {
  opn('http://localhost:'+PORT);
});

gulp.task('watch', ['connect', 'serve', 'style', 'lib'], function() {
  gulp.watch(['app/**/*.styl'], ['style']);
  plugins.livereload.listen();
  gulp.watch([
    'app/**/*.{css,html,js}',
  ]).on('change', plugins.livereload.changed).on('change', console.log.bind(console, 'changed'));
});
