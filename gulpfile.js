const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browsersync = require('browser-sync').create();

function browserSync(done) {
    browsersync.init({
        proxy: "localhost:5000"
    });
    done();
}
  
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

function css() {
    return gulp
        .src("./assets/scss/*.scss")
        .pipe(plumber())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('styles.css'))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest("./public/css/"))
        .pipe(browsersync.stream());
}

function scripts() {
    return gulp
        .src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            './assets/js/custom.js'
        ])
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(browsersync.stream());
}

function watchFiles() {
    gulp.watch("./assets/scss/**/*", css);
    gulp.watch("./assets/js/**/*", scripts);
    gulp.watch("./views/**/*", browserSyncReload);
}

const build = gulp.series(gulp.parallel(css, scripts));
const watch = gulp.parallel(watchFiles, browserSync);


exports.css = css;
exports.scripts = scripts;
exports.build = build;
exports.watch = watch;
exports.default = build;