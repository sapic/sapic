const { src, dest, parallel, series } = require('gulp')
const concat = require('gulp-concat')
const concatCss = require('gulp-concat-css')
const uglify = require('gulp-uglify')
const useref = require('gulp-useref')
const del = require('del')
const fs = require('fs')
const postcss = require('gulp-postcss')
const uncss = require('postcss-uncss')
const cssnano = require('cssnano')
const pug = require('gulp-pug')
const rename = require('gulp-rename')
const prettyHtml = require('gulp-pretty-html')
// const pugLinter = require('gulp-pug-linter')
const stylus = require('gulp-stylus')

function css1() {
  return src(['./src/css/*.styl'])
    .pipe(stylus())
    .pipe(concatCss('styl.css'))
    .pipe(dest('./out'))
}

function css2() {
  fs.unlink('./src/index_build.html', () => { })
  return src([
    './src/css/buttons.css',
    './src/css/shared_global.css',
    './src/css/modalContent.css',
    './src/css/economy.css',
    './src/css/globalv2.css',
    './src/css/slider.css',
  ])
    .pipe(
      postcss([
        uncss({
          html: ['./out/index.html'],
          htmlroot: 'out',
          jsdom: {},
        }),
      ]),
    )
    .pipe(concatCss('temp.css'))
    .pipe(dest('./out'))
}

function css3() {
  return src([
    './src/css/profilev2.css',
    './src/css/motiva_sans.css',
    './src/css/social-likes_flat.css',
    './src/css/font-awesome.css',
    './out/temp.css',
    './out/styl.css',
  ])
    .pipe(concatCss('main.css'))
    .pipe(postcss([cssnano()]))
    .pipe(dest('./out'))
}

function js() {
  const content = fs.readFileSync('./src/js/index.js', {
    encoding: 'utf-8',
  })
  fs.writeFileSync(
    './src/js/index_build.js',
    content.replace(/{{#vernum}}/g, process.env.CIRCLE_BUILD_NUM),
  )
  return src(
    [
      './src/js/clipboard.js',
      './src/js/jquery.min.js',
      './src/js/store.everything.min.js',
      './src/js/jquery.smooth-scroll.min.js',
      './src/js/interact-1.2.9.min.js',
      './src/js/social-likes.min.js',
      './src/js/index_build.js',
      './src/js/jQueryRotate.js',
    ],
    { sourcemaps: true },
  )
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(dest('./out', { sourcemaps: true }))
}

function jsfin() {
  return src(['./out/main.js', './src/js/networkn.js'])
    .pipe(concat('main.js'))
    .pipe(dest('./out', { sourcemaps: true }))
}

function js2() {
  return src(['./src/fuckadblock.js'])
    .pipe(uglify())
    .pipe(dest('./out'))
}

function html1() {
  return (
    src(['./src/index.pug'])
      // .pipe(pugLinter({ reporter: 'default', failAfterError: true }))
      .pipe(pug())
      .pipe(prettyHtml())
      .pipe(dest('./src'))
  )
}

function html2() {
  const content = fs.readFileSync('./src/index.html', {
    encoding: 'utf-8',
  })
  fs.writeFileSync(
    './src/index_build.html',
    content.replace(/{{#vernum}}/g, process.env.CIRCLE_BUILD_NUM),
  )
  return src(['./src/index_build.html'])
    .pipe(rename('index.html'))
    .pipe(useref())
    .pipe(dest('./out'))
}

function images() {
  return src('./src/images/**').pipe(dest('./out/images/'))
}

function fonts() {
  return src('./src/fonts/*').pipe(dest('./out/fonts/'))
}

function cleanup() {
  return del([
    './out/temp.css',
    './src/js/index_build.js',
    './src/index.html',
    './out/styl.css',
  ])
}

function static() {
  return src('./static/*').pipe(dest('./out'))
}

exports.miscFiles = parallel(images, fonts)
exports.js = parallel(
  series(js, jsfin),
  js2,
)

exports.page = series(html1, html2, parallel(css1, css2), css3)

exports.default = series(
  static,
  parallel(
    series(html1, html2, parallel(css1, css2), css3),
    images,
    fonts,
  ),
  js,
  js2,
  jsfin,
  cleanup,
)
