var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var header = require('gulp-header');
var fs = require('fs');
var browserify = require('gulp-browserify');

gulp.task('combine', function() {
  gulp.src('dist/index.js')
    .pipe(plumber())
    .pipe(browserify({
      debug: false,
      e: 'test'
    }))
    //.pipe(header('/**@license\r\n' + fs.readFileSync('LICENSE', 'utf8') + '*/\r\n'))
    .pipe(rename("command.js"))
    .pipe(gulp.dest('.'))
    /*.pipe(uglify({
      preserveComments: 'some'
    }))
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('.'))*/;
});

gulp.task('watch', function() {
  gulp.watch('dist/**/*.js', ['combine']);
});
