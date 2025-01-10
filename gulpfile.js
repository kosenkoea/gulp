import gulp from 'gulp';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import *as dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import {deleteAsync} from 'del';



const paths = {
    styles: {
        src: './src/styles/**/*.scss',
        dest: './dist/css/'
    },
    scripts: {
        src: './src/scripts/**/*.js',
        dest: './dist/js/'
    },
}


async function clean() {
    try {
        await deleteAsync(['dist']);
    } catch (error) {
        console.error('Error clean func:', error);
    }
}

async function css() {
    try {
        await gulp.src(paths.styles.src)
            .pipe(sass())
            .pipe(cleanCSS())
            .pipe(rename({basename:'main',suffix: '.min'}))
            .pipe(gulp.dest(paths.styles.dest));
    } catch (error) {
        console.error('Error style func:', error);
    }
}

async function js() {
    try {
        await gulp.src(paths.scripts.src,{sourcemaps: true})
            .pipe(babel())
            .pipe(uglify())
            .pipe(concat('main.min.js'))
            .pipe(gulp.dest(paths.scripts.dest))
    } catch (error) {
        console.error('Error style func:', error);
    }
}

function watch() {
    gulp.watch(paths.styles.src, css)
    gulp.watch(paths.scripts.src, js)
}


// Экспорт задач
export { clean }
export { css }
export { js }
export { watch }

// Построение сценариев выполнения задач
const development = gulp.series(clean, gulp.parallel(css, js), watch);

// Экспорт сценариев
export { development }

// Выполнение сценария по умолчанию
gulp.task('default', development);