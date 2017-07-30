var gulp        =   require("gulp");
var clean       =   require('gulp-clean');

gulp.task('default', function(){
    gulp.src('./dist', {read:false}).pipe(clean());
    return gulp.src('./build', {read:false}).pipe(clean());

});
