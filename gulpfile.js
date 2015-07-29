var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var header = require('gulp-header');
var fs = require('fs');

gulp.task('combine', function() {
  gulp.src('build/dist/**/*.js')
    .pipe(plumber())
    .pipe(concat('command.js'))
    .pipe(header('/**@license\r\n' + fs.readFileSync('LICENSE', 'utf8') + '*/\r\n'))
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
  gulp.watch('build/dist/**/*.js', ['combine']);
});
