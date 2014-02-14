var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint');

gulp.task('default', ['lint', 'watch']);

gulp.task('lint', function () {
    gulp.src('./lib/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function () {
    var watcher = gulp.watch('./**/*.js', ['lint']);
    watcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
