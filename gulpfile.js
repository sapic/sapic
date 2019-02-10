var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var rimraf = require('gulp-rimraf');
var fs = require('fs');
var postcss = require('gulp-postcss');
var uncss = require('postcss-uncss');
var cssnano = require('cssnano');
var rename = require('gulp-rename');

gulp.task('uncss', function () {
  fs.unlink('./index_build.html', () => {});
  return gulp.src([
      './src/css/buttons.css',
      './src/css/shared_global.css',
      './src/css/modalContent.css',
      './src/css/economy.css',
      './src/css/globalv2.css',
      './src/css/slider.css',
      './src/css/font-awesome.css',
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

gulp.task('normalcss', function () {
  return gulp.src([
      './src/css/profilev2.css',
      './src/css/index.css',
      './src/css/motiva_sans.css',
      './src/css/social-likes_flat.css',
      './out/temp.css',
      './src/css/newui.css'
    ])
    .pipe(concatCss('main.css'))
    .pipe(postcss([
      cssnano()
    ]))
    .pipe(gulp.dest('./out'));
});

gulp.task('js', function () {
  var content = fs.readFileSync('./src/js/index.js', {
    encoding: 'utf-8'
  });
  fs.writeFileSync('./src/js/index_build.js', content.replace(/{{#vernum}}/g, process.env.CIRCLE_BUILD_NUM));
  return gulp.src([
      './src/js/jquery.min.js',
      './src/js/store.everything.min.js',
      './src/js/jquery.smooth-scroll.min.js',
      './src/js/interact-1.2.9.min.js',
      './src/js/social-likes.min.js',
      './src/js/index_build.js',
      './src/js/jQueryRotate.js',
      './src/js/clipboard.js',
    ])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./out'));
});

gulp.task('js2', function () {
  return gulp.src(['./src/fuckadblock.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./out'));
});

gulp.task('html', function () {
  var content = fs.readFileSync('./src/index.html', {
    encoding: 'utf-8'
  });
  fs.writeFileSync('./index_build.html', content.replace(/{{#vernum}}/g, process.env.CIRCLE_BUILD_NUM));
  return gulp.src(['./index_build.html'])
    .pipe(useref())
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./out'));
});

gulp.task('images', function () {
  return gulp.src('./src/images/**')
    .pipe(gulp.dest('./out/images/'));
});

gulp.task('fonts', function () {
  return gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./out/fonts/'));
});

gulp.task('page', gulp.series('html', 'uncss', 'normalcss'))

gulp.task('default', gulp.parallel('page', 'js', 'js2', 'images', 'fonts'), function () {
  return gulp.src('./out/temp.css', './js/index_build.js', {
      read: false
    })
    .pipe(rimraf());
});