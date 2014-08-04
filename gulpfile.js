var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch')
    minify = require('gulp-minify-css')

var buildSass = function() {
  gulp.src('stylesheets/*.scss')
      .pipe(sass({
        outputStyle: 'compressed'
      }))
      .pipe(minify({ cache: true }))
      .pipe(gulp.dest('./css'))
}

gulp.task('default', ['styles'])

gulp.task('styles', buildSass)

gulp.task('watch', function() {
  gulp.src('stylesheets/*.scss')
      .pipe(watch())
      .pipe(sass({
        errLogToConsole: true
      }))
      .pipe(gulp.dest('./css'))
})
