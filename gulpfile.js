var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var htmlmin = require('gulp-minify-html');
var rimraf = require('gulp-rimraf');
var fs = require('fs');
var postcss = require('gulp-postcss');
var uncss = require('postcss-uncss');
var cssnano = require('cssnano');
var rename = require('gulp-rename');

gulp.task('css1', ['html', 'js', 'js2'], function() {
  return gulp.src(['./css/buttons.css', './css/social-likes_flat.css', './css/shared_global.css',
    './css/modalContent.css',
    './css/header.css', './css/economy.css', './css/economy_inventory.css', './css/globalv2.css', './css/slider.css', './css/font-awesome.css', './css/font-awesome.min.css', './css/social-likes_flat.css'
    ])
    .pipe(concatCss('temp.css'))
    .pipe(postcss([
      uncss({
        html: ['./out/index.html'],
        htmlroot: 'out',
      }),
      cssnano()
    ]))
    .pipe(gulp.dest('./out'));
});
gulp.task('css2', ['css1'], function() {
  return gulp.src(['./css/profilev2.css', './css/index.css', './css/motiva_sans.css', './out/temp.css'])
    .pipe(concatCss('main.css'))
    .pipe(postcss([
      cssnano()
    ]))
    .pipe(gulp.dest('./out'));
});
gulp.task('js', function() {
  var content = fs.readFileSync('./js/index.js', {
    encoding: 'utf-8'
  });
  fs.writeFileSync('./js/index_build.js', content.replace(/{{#vernum}}/g, process.env.CIRCLE_BUILD_NUM));
  return gulp.src([
    './js/jquery.min.js',
    './js/store.everything.min.js',
    './js/release.js',
    './js/jquery.smooth-scroll.min.js',
    './js/interact-1.2.9.min.js',
    './js/FileSaver.js',
    './js/social-likes.min.js',
    './js/index_build.js',
    './js/jQueryRotate.js',
    './js/clipboard.js',
  ])
    .pipe(concat('main.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./out'));
});
gulp.task('js2', function() {
  return gulp.src(['./js/fuckadblock.js', './js/holiday.js'])
    .pipe(gulp.dest('./out'));
});
gulp.task('html', function() {
  var content = fs.readFileSync('./index.html', {
    encoding: 'utf-8'
  });
  fs.writeFileSync('./index_build.html', content.replace(/{{#vernum}}/g, process.env.CIRCLE_BUILD_NUM));
  return gulp.src(['./index_build.html'])
    .pipe(useref())
    .pipe(htmlmin())
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./out'));
});
gulp.task('images', function() {
  return gulp.src('./images/**')
    .pipe(gulp.dest('./out/images/'));
});

gulp.task('fonts', function() {
  return gulp.src('./fonts/*')
    .pipe(gulp.dest('./out/fonts/'));
});

gulp.task('default', ['css2', 'images', 'fonts'], function() {
  return gulp.src('./out/temp.css', {
      read: false
    })
    .pipe(rimraf());
});
