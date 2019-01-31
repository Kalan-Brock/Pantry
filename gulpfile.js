const config = require('./config');
const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const browsersync = require('browser-sync').create();
const exec = require('child_process').exec;
const ngrok = require('ngrok');

function browserSync(done) {
    browsersync.init({
        proxy: "localhost:" + config.sitePort
    }, function(err, bs) {
        (async function() {
            const url = await ngrok.connect(3000);
        })();

        process.stdout.write("ngrok: http://localhost:4040" + "\r");
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
        ])0
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(browsersync.stream());
}

function staticfiles(done) {
    if(config.generateStaticFiles) {
        exec('node ./tools/staticpages.js', {shell: false});
    }
    done();
}

function watchFiles() {
    gulp.watch("./assets/scss/**/*", css);
    gulp.watch("./assets/js/**/*", scripts);
    gulp.watch("./views/**/*", gulp.series(staticfiles, browserSyncReload));
}

const build = gulp.series(gulp.parallel(css, scripts), staticfiles);
const watch = gulp.parallel(watchFiles, browserSync);


exports.css = css;
exports.scripts = scripts;
exports.build = build;
exports.watch = watch;
exports.default = build;