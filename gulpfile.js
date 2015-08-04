var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var header = require('gulp-header');
var fs = require('fs');
var browserify = require('gulp-browserify');
var peg = require('gulp-peg');

gulp.task('peg', function() {
  gulp.src('*.pegjs')
    .pipe(peg())
    .pipe(gulp.dest('./dist'));
});

gulp.task('combine', ['peg'], function() {
  gulp.src('dist/index.js')
    .pipe(plumber())
    .pipe(browserify({
      debug: false,
      standalone: 'CommandJS'
    }))
    .pipe(header('/**@license\r\n' + fs.readFileSync('LICENSE', 'utf8') + '*/\r\n'))
    .pipe(rename("command.js"))
    .pipe(gulp.dest('.'))
    .pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  gulp.watch('dist/**/*.js', ['combine']);
  gulp.watch('*.pegjs', ['combine']);
});
