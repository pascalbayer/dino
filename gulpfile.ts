/// <reference path="typings/tsd.d.ts"/>

import * as gulp from 'gulp';
import * as tsc from 'gulp-tsc';

gulp.task('build', () => {
    gulp.src('src/**/*.ts')
        .pipe(tsc())
        .pipe(gulp.dest('lib/'));
});
