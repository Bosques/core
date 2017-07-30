var gulp        =   require("gulp");
var runSequence =   require('run-sequence');
//var sass        =   require('node-sass');
var shell       =   require('gulp-shell');


gulp.task("default", shell.task(['node-sass ./scss/ -o ./dist/']));

