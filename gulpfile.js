const config = require('./config/config.js');
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
        proxy: "localhost:" + global.gConfig.sitePort
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

function admincss() {
    return gulp
        .src("./assets/admin-scss/*.scss")
        .pipe(plumber())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('adminstyles.css'))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest("./public/css/"))
        .pipe(browsersync.stream());
}

function ampcss() {
    return gulp
        .src("./assets/amp-scss/*.scss")
        .pipe(plumber())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(concat('ampstyles.css'))
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
        .pipe(concat('custom.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(browsersync.stream());
}

function adminscripts() {
    return gulp
        .src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
            './assets/js/admin.js'
        ])
        .pipe(plumber())
        .pipe(concat('admin.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(browsersync.stream());
}

function ampscripts() {
    return gulp
        .src([
            './assets/js/amp.js'
        ])
        .pipe(plumber())
        .pipe(concat('amp.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(browsersync.stream());
}

function staticfiles(done) {
    if(global.gConfig.generateStaticFiles) {
        exec('node ./tools/staticpages.js', {shell: false});
    }
    done();
}

function watchFiles() {
    gulp.watch("./assets/scss/**/*", css);
    gulp.watch("./assets/admin-scss/**/*", admincss);
    // Rebuild amp files if amp css is changed, since it gets inlined in the static files.
    gulp.watch("./assets/amp-scss/**/*", gulp.series(ampcss, staticfiles));
    gulp.watch("./assets/js/custom.js", scripts);
    gulp.watch("./assets/js/admin.js", adminscripts);
    gulp.watch("./assets/js/amp.js", ampscripts);
    gulp.watch("./views/**/*", gulp.series(staticfiles, browserSyncReload));
}

const build = gulp.series(css, admincss, ampcss, scripts, adminscripts, ampscripts, staticfiles);
const watch = gulp.parallel(watchFiles, browserSync);


exports.css = css;
exports.scripts = scripts;
exports.build = build;
exports.watch = watch;
exports.default = build;