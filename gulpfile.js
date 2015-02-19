'use strict';
var src = './src',
    dist = './public',
    nodeModules = './node_modules',
    express = require('express'),
    app = express(),
    serve = require('./app'),
    gulp = require('gulp'),
    jade = require('gulp-jade'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    annotate = require('gulp-ng-annotate'),
    karma = require('karma'),
    file = require('file'),
    path = require('path'),
    // sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    minifyCSS = require('gulp-minify-css'),
    port = 9090,
    tasks;

tasks = {
  test : function() {

  },
  server : {
    start : function() {
      app.use(serve);
      app.listen(port);
      console.log('Listen on port: ', port);
    }
  },
  watch: function () {
    livereload.listen();
    gulp.watch([src + '/js/*.js', src ], ['build:ag']);
    gulp.watch([src + '/jade/**/*.jade'], ['build:templates']);
    // gulp.watch([src + '/modules/**/*.sass'], ['build:styles']);
    gulp.watch([src + '/styles/*.styl'], ['build:stylesCustom']);
  },
  build : {
    js : {
      vendors: function () {
        gulp.src([
          nodeModules + '/angular/*.min.js',
          nodeModules + '/angular-ui-router/release/*.min.js',
          nodeModules + '/angular-cookies/angular-cookies.js'
        ])
          .pipe(concat('libraries.js'))
          .pipe(annotate({single_quotes: true}))
          .pipe(uglify())
          .pipe(gulp.dest(dist + '/js/vendors/'));
        // Copy the angular map
        gulp.src(nodeModules + '/angular/*.map')
          .pipe(gulp.dest(dist + '/js/vendors/'));
      },
      ag : function() {

        gulp.src([
          src + '/js/common.module.js/',
          src + '/js/app.module.js/',
          src + '/js/**/*.js'
        ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist + '/js/ag/'));
      }
    },
    templates: function () {
      gulp.src(src + '/jade/views/**/*.jade')
        .pipe(jade({ 
          pretty: true
        }))
        .pipe(gulp.dest(dist + '/views/'))
        .pipe(livereload());
    },
    styles : {
      libraries: function () {
        gulp.src([
            nodeModules + '/bootstrap/dist/css/bootstrap-theme.css',
            nodeModules + '/bootstrap/dist/css/bootstrap.css',
            nodeModules + '/normalize-css/normalize.css'
          ])
          .pipe(concat('libraries.min.css'))
          // .pipe(sass())
          .pipe(minifyCSS())
          .pipe(gulp.dest(dist + '/styles/'));
      },
      custom : function() {
        gulp.src([
          src + '/styles/**/*.styl'
        ])
        .pipe(concat('main.styl'))
        .pipe(stylus())
        .pipe(minifyCSS())
        .pipe(gulp.dest(dist + '/styles/'))
        .pipe(livereload());
      }
    }
  }
};

/**
 * Gulp grouped tasks
 */
gulp.task('default', [
    'build:templates',
    'build:libraries',
    'build:styles',
    'build:stylesCustom',
    'build:ag',
    'watch'
  ]);

/**
 * styles Libraries
 */
gulp.task('watch', tasks.watch);

/**
 * styles Libraries
 */
gulp.task('build:styles', tasks.build.styles.libraries);

/**
 * styles custom
 */
gulp.task('build:stylesCustom', tasks.build.styles.custom);

/**
 * Templates
 */
gulp.task('build:templates', tasks.build.templates);

/**
 * Set scripts (3rd party)
 */
gulp.task('build:libraries', tasks.build.js.vendors);

/**
 * Set scripts angular app
 */
gulp.task('build:ag', tasks.build.js.ag);

/**
 * Server task
 */
gulp.task('server', tasks.server.start);

/**
 * Iterates through a given folder and find the files that match certain criteria
 * @param  {String} src path of folder to iterate
 * @return {Array} filesToCompile source of files
 */
function getModules(src) {
  var filesToCompile = [];

  // Updating 'filesToCompile' array with expected src's
  file.walkSync(src, function (dirPath, dirs, files) {
    var module = path.basename(dirPath),
      tempModuleFiles = [];

    if (files.length < 1) {
      return;
    }

    // Updating the 'tempModuleFiles' array with files of extension *.js
    for (var i = 0; i < files.length; i++) {
      if (path.extname(path.basename(files[i])) === '.js') {
        tempModuleFiles.push(files[i]);
      }
    }

    if (tempModuleFiles.length < 1) {
      return;
    }

    tempModuleFiles = tempModuleFiles.sort(function (a, b) {
      return path.basename(a, '.js') === module + '.module' ? -1 : 1;
    }).map(function (value) {
      return path.join(dirPath, value);
    });

    filesToCompile = filesToCompile.concat(tempModuleFiles);
  });

  return filesToCompile;
}