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

gulp.task('css1', function() {
  fs.unlink('./index_build.html');
  return gulp.src([
    './css/*.css',
    '!./css/profilev2.css',
    '!./css/index.css',
    '!./css/motiva_sans.css',
    '!./css/social-likes_flat.css',
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

gulp.task('css2', function() {
  return gulp.src([
    './css/profilev2.css',
    './css/index.css',
    './css/motiva_sans.css',
    './css/social-likes_flat.css',
    './out/temp.css'
  ])
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
  return gulp.src(['./js/*.js', '!./fuckadblock.js', '!./js/holiday.js'])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./out'));
});

gulp.task('js2', function() {
  return gulp.src(['./fuckadblock.js', './js/holiday.js'])
  .pipe(uglify())
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

gulp.task('page', gulp.series('html', 'css1', 'css2'))

gulp.task('default', gulp.parallel('page', 'js', 'js2', 'images', 'fonts'), function() {
  return gulp.src('./out/temp.css', {
      read: false
    })
    .pipe(rimraf());
});
