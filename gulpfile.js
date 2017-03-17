// Modules & Plugins
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssminify = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var connect = require('gulp-connect'); 
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');

// Error Helper
function onError(err) {
    console.log(err);
}

// Server Task
gulp.task('server', function() {
	connect.server({
	    root: 'server',
	    livereload: true
  	});
});

// Styles Task
gulp.task('styles', function() {
    return gulp.src('src/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.css'))
        .pipe(cssminify())  
        .pipe(sourcemaps.write())      
        .pipe(gulp.dest('server/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('html', function () {
  	return gulp.src('src/*.html')
  		.pipe(gulp.dest('server'))
        .pipe(notify({ message: 'Html task complete' }));
});

// Scripts Task
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('server/js'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Images Task
gulp.task('images', function() {
    return gulp.src('src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('server/img'))
        .pipe(notify({ message: 'Images task complete' }));
});


// Clean Task
gulp.task('clean', function() {
    return gulp.src(['server/css/*', 'server/js/*, server/img/*'], {read: false})
        .pipe(clean());
});

// Watch Task
gulp.task('watch', function() {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/css/*.css', ['styles']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/img/*', ['images']);

    // Watch any files in server/, reload on change
    livereload.listen();
    gulp.watch(['server/**']).on('change', livereload.changed);
});

// Default Task
gulp.task('default', ['clean', 'html', 'styles', 'scripts', 'images', 'server', 'watch']);

