var gulp    =   require('gulp');
var shell   =   require('gulp-shell');

gulp.task("ts", function(){
    gulp.watch(["./src/**/*.ts"], ["rebuild"]);
});
gulp.task("asset", function(){
    gulp.watch(["./asset/**/*.*"], ["reasset"]);
});
gulp.task("vendor", function(){
    gulp.watch(["./vendor/**/*.*"], ["revendor"]);
});
gulp.task("html", function(){
    gulp.watch(["./page/**/*.html"], ["recopy"]);
});
gulp.task("rebuild", shell.task(['gulp --gulpfile gulpfile-ts.js']));
gulp.task("reasset", shell.task(['gulp --gulpfile gulpfile-asset.js']));
gulp.task("revendor", shell.task(['gulp --gulpfile gulpfile-vendor.js']));
gulp.task("recopy", shell.task(['gulp --gulpfile gulpfile-page.js']));