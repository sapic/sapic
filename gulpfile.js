var gulp = require('gulp');
var uncss = require('gulp-uncss');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var htmlmin = require('gulp-minify-html');
var rimraf = require('gulp-rimraf');
var fs = require('fs');

gulp.task('css1', function(){
    return gulp.src(['./css/buttons.css','./css/shared_global.css',
        './css/modalContent.css', './css/motiva_sans.css',
        './css/header.css', './css/economy.css', './css/economy_inventory.css', './css/globalv2.css', './css/slider.css', './css/font-awesome.css', './css/font-awesome.min.css'])
        .pipe(uncss({
            html: ['index.html']
        }))
        .pipe(concatCss('temp.css'))
        .pipe(csso())
        .pipe(gulp.dest('./out'));
});
gulp.task('css2', ['css1'], function(){
    return gulp.src(['./css/profilev2.css', './css/index.css', './out/temp.css'])
        .pipe(concatCss('main.css'))
        .pipe(csso())
        .pipe(gulp.dest('./out'));
});
gulp.task('js', ['css2'], function(){
    var content = fs.readFileSync('./js/index.js', {encoding:'utf-8'});
    fs.writeFileSync('./js/index.js', content.replace('{{#vernum}}', process.env.CIRCLE_BUILD_NUM));
    return gulp.src(['./js/jquery.min.js', './js/store.everything.min.js', './js/release.js', './js/linq.min.js', './js/jszip.js', './js/jquery.smooth-scroll.min.js', './js/interact-1.2.2.min.js', './js/FileSaver.js', './js/index.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./out'));
});
gulp.task('js2', function(){
    return gulp.src('./js/fuckadblock.js')
        .pipe(gulp.dest('./out'));
});
gulp.task('html', ['js', 'js2'], function(){
    return gulp.src(['index.html'])
        .pipe(useref())
        .pipe(htmlmin())
        .pipe(gulp.dest('./out'));
});
gulp.task('images', function(){
    return gulp.src('./images/*')
        .pipe(gulp.dest('./out/images/'));
});

gulp.task('fonts', function(){
    return gulp.src('./fonts/*')
        .pipe(gulp.dest('./out/fonts/'));
});

gulp.task('default', ['html', 'images', 'fonts'], function() {
    return gulp.src('./out/temp.css', { read: false })
        .pipe(rimraf());
});