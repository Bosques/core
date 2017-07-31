var gulp    =   require('gulp');
var shell   =   require('gulp-shell');

gulp.task("default", shell.task(['gulp --gulpfile gulpfile-ts.js']));
