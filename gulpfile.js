/// <reference path="typings/tsd.d.ts"/>
var gulp = require('gulp');
var concat = require('gulp-concat');
var typescript = require('gulp-typescript');
var info = require('./package.json');
gulp.task('build', function () {
    var typescriptConfig = typescript.createProject('tsconfig.json');
    var typescriptResult = gulp.src('src/**/*.ts')
        .pipe(typescript(typescriptConfig));
    return typescriptResult.js.pipe(gulp.dest('lib/'));
});
gulp.task('build:declaration', function () {
    var typescriptResult = gulp.src('src/**/*.ts')
        .pipe(typescript({
        module: 'commonjs',
        declaration: true
    }));
    return typescriptResult.dts.pipe(concat(info.name + '.d.ts'))
        .pipe(gulp.dest('lib/'));
});
//# sourceMappingURL=gulpfile.js.map