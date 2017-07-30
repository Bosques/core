var gulp        =   require("gulp");
var runSequence =   require('run-sequence');

gulp.task("default", function(done){
    return gulp.src("./vendor/**/*.*").pipe(gulp.dest("dist/"));
});
