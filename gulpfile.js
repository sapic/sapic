var gulp = require('gulp');
var uncss = require('gulp-uncss');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var htmlmin = require('gulp-minify-html');
var rimraf = require('gulp-rimraf');

gulp.task('css1', function(){
    return gulp.src(['./css/buttons.css', './css/index.css','./css/shared_global.css',
        './css/modalContent.css', './css/motiva_sans.css',
        './css/header.css', './css/economy.css', './css/economy_inventory.css', './css/globalv2.css', './css/slider.css'])
        .pipe(uncss({
            html: ['index.html']
        }))
        .pipe(concatCss('temp.css'))
        .pipe(csso())
        .pipe(gulp.dest('./out'));
});
gulp.task('css2', ['css1'], function(){
    return gulp.src(['./css/profilev2.css', './css/social-likes_flat.css', './css/minimap.css', './out/temp.css'])
        .pipe(concatCss('main.css'))
        .pipe(csso())
        .pipe(gulp.dest('./out'));
});
gulp.task('js', ['css2'], function(){
    return gulp.src(['./js/jquery.min.js', './js/*'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./out'));
});
gulp.task('html', ['js'], function(){
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(htmlmin())
        .pipe(gulp.dest('./out'));
});
gulp.task('favicon', function(){
    return gulp.src('favicon.ico')
        .pipe(gulp.dest('./out'));
});

gulp.task('default', ['html', 'favicon'], function() {
    return gulp.src('./out/temp.css', { read: false })
        .pipe(rimraf());
});