var gulp        =   require("gulp");
var runSequence =   require('run-sequence');
var ts          =   require('gulp-typescript');


gulp.task("default", function(done){
    var tsProject = ts.createProject('tsconfig.json', {});
    var tsResult = tsProject.src() 
        .pipe(tsProject());
 
    tsResult.js.pipe(gulp.dest('./'));
    tsResult.dts.pipe(gulp.dest('./'));
    done();
});

