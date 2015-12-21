/// <reference path="typings/tsd.d.ts"/>

import { Project } from "gulp-typescript";

import * as gulp from 'gulp';
import * as concat from 'gulp-concat';
import * as typescript from 'gulp-typescript';
import * as info from './package.json';

gulp.task('build', () => {
    let typescriptConfig : Project = typescript.createProject('tsconfig.json');

    let typescriptResult = gulp.src('src/**/*.ts')
        .pipe(typescript(typescriptConfig));

    return typescriptResult.js.pipe(gulp.dest('lib/'));
});

gulp.task('build:declaration', () => {
    let typescriptResult = gulp.src('src/**/*.ts')
        .pipe(typescript({
            module: 'commonjs',
            declaration: true
        }));

    return typescriptResult.dts.pipe(concat(info.name + '.d.ts'))
        .pipe(gulp.dest('lib/'));
});
