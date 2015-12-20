var gulp = require('gulp');
var tsc = require('gulp-tsc');
gulp.task('build', function () {
    gulp.src('src/**/*.ts')
        .pipe(tsc())
        .pipe(gulp.dest('lib/'));
});
//# sourceMappingURL=gulpfile.js.map