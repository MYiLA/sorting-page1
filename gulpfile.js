// 'use strict';
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sourcemap = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var server = require('browser-sync').create();
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var webp = require('gulp-webp');
var svgstore = require('gulp-svgstore')
var posthtml = require('gulp-posthtml');
var include = require('posthtml-include');
var del = require('del');
var uglify = require('gulp-uglify-es').default;
var htmlmin = require('gulp-htmlmin')
var autoprefixer = require('autoprefixer');
var pug = require('gulp-pug');
var htmlBeautify = require('gulp-html-beautify');
const babel = require('gulp-babel');

gulp.task('htmlBeautify', () => {
  return gulp.src('temp/pug/*.html')
    .pipe(htmlBeautify({
      indentSize: 2,
      unformatted: [
        'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite','code', 'data', 
        'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins', 'kbd', 
        'keygen', 'map', 'mark', 'math', 'meter', 'noscript','object', 
        'output', 'progress', 'q', 'ruby', 's', 'samp', 'small','strong', 
        'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
        'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt', 'p']
      }))
    .pipe(gulp.dest('temp'))
});

gulp.task('js', () => {
  return gulp.src('source/js/**')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
});

gulp.task('copy-polyfill', () => {
  return gulp.src('node_modules/@babel/polyfill/dist/polyfill.min.js')
    .pipe(gulp.dest('build/js/'));
});

gulp.task('pug', () => {
  return gulp.src('source/pug/pages/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('temp/pug'))
});

gulp.task('clean', () => {
  return del('build', 'temp');
});

gulp.task('copy', () => {
  return gulp.src([
      'source/fonts/*',
      'source/img/**',
      'source/glide/**'
    ], {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('css', () => {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('sprite', () => {
  return gulp.src('source/img/icon-*.svg')
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
});
gulp.task('html', () => {
  return gulp.src('temp/*.html')
    .pipe(posthtml([include()]))
    .pipe(htmlmin())
    .pipe(gulp.dest('build'));
});
gulp.task('images', () => {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('source/img'));
});

gulp.task('webp', () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest('source/img'));
});

gulp.task('server', () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.task('refresh', (done) => {
    server.reload();
    done();
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/img/icon-*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('temp/*.html', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/js/*.js', gulp.series('js', 'refresh'));
  gulp.watch('source/pug/**/*.pug', gulp.series('pug', 'htmlBeautify'));
});

gulp.task('build', gulp.series(
  'clean',
  'pug',
  'htmlBeautify',
  'copy',
  'js',
  'copy-polyfill',
  'css',
  'sprite',
  'html'
));

gulp.task('start', gulp.series(
  'build',
  'server'
));

gulp.task('optimizeimg', gulp.series(
  'images',
  'webp'
));

  //   'browser-sync': '2.26.x',
  //   'gulp': '^4.0.2',
  //   'gulp-csso': '^3.0.1',
  //   'gulp-imagemin': '^6.1.0',
  //   'gulp-plumber': '1.2.x',
  //   'gulp-postcss': '8.0.x',
  //   'gulp-posthtml': '^3.0.4',
  //   'gulp-rename': '^1.4.0',
  //   'gulp-sass': '^4.0.2',
  //   'gulp-sourcemaps': '2.6.x',
  //   'gulp-svgstore': '^7.0.1',
  //   'gulp-webp': '^4.0.1',
  //   'posthtml-include': '^1.2.0',
  //   'stylelint': '10.1.x'},
  // 'scripts': {
  //   'stylelint': 'stylelint \'source/sass/**/*.scss\' --syntax scss',
  //   'test': 'npm run stylelint',
  //   'build': 'gulp build',
  //   'optimizeimg': 'gulp optimizeimg',
  //   'start': 'gulp start'