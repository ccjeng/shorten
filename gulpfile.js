// Modules & Plugins
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssminify = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect'); 
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var ghPages = require('gulp-gh-pages');

const dirs = {
  src: 'src',
  dest: 'server'
};

const stylesPaths = {
  src: dirs.src + '/css/*.css',
  dest: dirs.dest + '/css'
};

const scriptsPaths = {
  src: dirs.src + '/js/*.js',
  dest: dirs.dest + '/js'
};

const imagesPaths = {
  src: dirs.src + '/img/*',
  dest: dirs.dest + '/img'
};


// Server Task
gulp.task('server', function() {
    connect.server({
        root: dirs.dest,
        livereload: true,
        port: 8080
    });
});

// Styles Task
gulp.task('styles', function() {
    return gulp.src(stylesPaths.src)
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.css'))
        .pipe(cssminify())  
        .pipe(sourcemaps.write('./'))      
        .pipe(gulp.dest(stylesPaths.dest))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    return gulp.src(dirs.src+'/*.html')
        .pipe(gulp.dest(dirs.dest))
        .pipe(connect.reload());
});

// Scripts Task
gulp.task('scripts', function() {
    return gulp.src(scriptsPaths.src)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(scriptsPaths.dest));
});

// Images Task
gulp.task('images', function() {
    return gulp.src(imagesPaths.src)
        .pipe(imagemin())
        .pipe(gulp.dest(imagesPaths.dest));
});


// Clean Task
gulp.task('clean', function() {
    return gulp.src([stylesPaths.dest+'/*', scriptsPaths.dest+'/*', imagesPaths.dest+'/*'], {read: false})
        .pipe(clean());
});

// Watch Task
gulp.task('watch', function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch(stylesPaths.src, ['styles']);
    gulp.watch(scriptsPaths.src, ['scripts']);
    gulp.watch(imagesPaths.src, ['images']);

    // Watch any files in server/, reload on change
    livereload.listen();
    gulp.watch(['server/**']).on('change', livereload.changed);
});

//Deploy to ghPages Task
gulp.task('ghpages', ['build'], function() {
  return gulp.src(dirs.dest+'/**/*')
    .pipe(ghPages());
});

// Default Task
gulp.task('default', ['clean', 'html', 'styles', 'scripts', 'images', 'server', 'watch']);
gulp.task('build', ['clean', 'html', 'scripts', 'styles', 'images']);
gulp.task('deploy', ['ghpages']);



