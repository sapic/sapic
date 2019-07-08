const { src, dest, parallel, series } = require('gulp');
const concat = require('gulp-concat');
const concatCss = require('gulp-concat-css');
const uglify = require('gulp-uglify');
const useref = require('gulp-useref');
const rimraf = require('gulp-rimraf');
const fs = require('fs');
const postcss = require('gulp-postcss');
const uncss = require('postcss-uncss');
const cssnano = require('cssnano');
const rename = require('gulp-rename');

function css1() {
    fs.unlink('./src/index_build.html', () => {});
    return src([
            './src/css/buttons.css',
            './src/css/shared_global.css',
            './src/css/modalContent.css',
            './src/css/economy.css',
            './src/css/globalv2.css',
            './src/css/slider.css'
        ])
        .pipe(postcss([
            uncss({
                html: ['./out/index.html'],
                htmlroot: 'out',
                jsdom: {},
            })
        ]))
        .pipe(concatCss('temp.css'))
        .pipe(dest('./out'));
}

function css2() {
    return src([
            './src/css/profilev2.css',
            './src/css/index.css',
            './src/css/motiva_sans.css',
            './src/css/social-likes_flat.css',
            './out/temp.css',
            './src/css/newui.css',
            './src/css/font-awesome.css'
        ])
        .pipe(concatCss('main.css'))
        .pipe(postcss([
            cssnano()
        ]))
        .pipe(dest('./out'));
}

function js() {
    const content = fs.readFileSync('./src/js/index.js', {
        encoding: 'utf-8'
    });
    fs.writeFileSync('./src/js/index_build.js', content.replace(/{{#vernum}}/g, process.env.CIRCLE_BUILD_NUM));
    return src([
            './src/js/jquery.min.js',
            './src/js/store.everything.min.js',
            './src/js/jquery.smooth-scroll.min.js',
            './src/js/interact-1.2.9.min.js',
            './src/js/social-likes.min.js',
            './src/js/index_build.js',
            './src/js/jQueryRotate.js',
            './src/js/clipboard.js',
        ], { sourcemaps: true })
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('./out', { sourcemaps: true }));
}

function js2() {
    return src(['./src/fuckadblock.js'])
        .pipe(uglify())
        .pipe(dest('./out'));
}

function html() {
    const content = fs.readFileSync('./src/index.html', {
        encoding: 'utf-8'
    });
    fs.writeFileSync('./src/index_build.html', content.replace(/{{#vernum}}/g, process.env.CIRCLE_BUILD_NUM));
    return src(['./src/index_build.html'])
        .pipe(rename('index.html'))
        .pipe(useref())
        .pipe(dest('./out'));
}

function images() {
    return src('./src/images/**')
        .pipe(dest('./out/images/'));
}

function fonts() {
    return src('./src/fonts/*')
        .pipe(dest('./out/fonts/'));
}

function cleanup() {
    return src('./out/temp.css', './js/index_build.js', {
            read: false
        })
        .pipe(rimraf());
}

exports.miscFiles = parallel(images, fonts);
exports.page = series(html, css1, css2);
exports.js = parallel(js, js2);

exports.default = series(
    parallel(
        series(html, css1, css2),
        js, js2, images, fonts
    ),
    cleanup
);