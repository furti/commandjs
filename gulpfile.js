var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

gulp.task('combine', function() {
  gulp.src('build/**/*.js')
    .pipe(plumber())
    .pipe(concat('command.js'))
    .pipe(gulp.dest('.'))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
  gulp.watch('build/**/*.js', ['combine']);
});
