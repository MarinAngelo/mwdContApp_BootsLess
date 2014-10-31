Schritt 1: Projektstruktur
==========================

    app/
        js/
            app.js
        css/
            app.css
        index.html

    dist/


Schritt 2: Gulp
===============


    npm init
    npm install gulp --save
    npm install del --save


Schritt 3: Gulpfile erstellen – dist
====================================


    'use strict';

    var gulp = require('gulp');

    gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

    gulp.task('build', function() {
      return gulp.src(['app/**'], {dot: true})
        .pipe(gulp.dest('dist'));
    });

    gulp.task('default', ['clean'], function () {
      gulp.start('build');
    });


Schritt 4: server
=================

## Shell

    npm install --save serve-static serve-index connect opn

## Gulpfile

    gulp.task('connect', function(cb) {
    	var server = connect();
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

Schritt 5: minify
=======================

## Shell

    npm install --save gulp-if gulp-uglify gulp-csso

## Gulpfile

    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', csso()))

Schritt 6: Konkatenieren mit Useref
===================================

## Problem

Wenn wir konkatenieren, müssen wir das HTML-File, das in `dist` landet anpassen: die ursprünglichen `<script>`- und `<link>`-Tags müssen ersetzt werden durch ein enzelnes, welches auf das Konkatenierte File verweist. Dieses Problem löst uns Useref.

## Shell

    npm install --save gulp-useref

## Projektstruktur

Um das Konkatenieren zu testen erstellen wir neue Assets, css/app-2.css und js/app-2.js.

## HTML

    <!-- build:css styles.css -->
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="css/app-2.css">
    <!-- endbuild -->
    <!-- build:js scripts.js -->
    <script src="js/app.js"></script>
    <script src="js/app-2.js"></script>
    <!-- endbuild -->


## Gulpfile

    var useref = require('gulp-useref');

…

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

Schritt 7: bower
================

## .bowerrc

    {
        "directory": "app/bower_components"
    }

## Shell

    npm install -g bower

    bower init
    bower install angular

## HTML

    <link rel="stylesheet" href="bower_components/angular/angular-csp.css">

…

    <script src="bower_components/angular/angular.js"></script>

Schritt 8: live reload
======================

## Shell

    npm install --save connect-livereload gulp-livereload

## Gulpfile

    var connectLivereload = require('connect-livereload');
    var gulpLivereload = require('gulp-livereload');

…

    server.use(connectLivereload({port: 35729}));

…

    gulp.task('watch', ['connect', 'serve'], function () {
      gulpLivereload.listen();
      gulp.watch([
        'app/**',
      ]).on('change', gulpLivereload.changed);
    });
