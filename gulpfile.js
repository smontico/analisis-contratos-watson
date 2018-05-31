var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var plumber = require('gulp-plumber');

gulp.task('app', function() {
  // place code for your default task here
});


gulp.task('default', function() {
    return gulp.src([
        'public/*.js',
        'public/view*/**/*.js'
    ])
	    .pipe(plumber())
			.pipe(concat('app.js', {newLine: ';'}))
			//.pipe(ngAnnotate({add: true}))
	    .pipe(plumber.stop())
        .pipe(gulp.dest('public/src/'));
});