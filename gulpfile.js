var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000);
var gulp = require('gulp');

gulp.task('Iconfont', function(){
    return gulp.src(['icons/*.svg'])
        .pipe(iconfont({
            fontName: 'appointer-icon', // required
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp, // recommended to get consistent builds when watching files
        }))
        .on('glyphs', function(glyphs, options) {
            // CSS templating, e.g.
            console.log(glyphs, options);
        })
        .pipe(gulp.dest('fonts/'));
});