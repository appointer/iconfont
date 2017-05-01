var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now()/1000);
var gulp = require('gulp');
var consolidate = require('gulp-consolidate');
var async = require('async');

var config = {
    iconSourcePath: ['icons/*.svg'],
    fontName: 'appointer-icon',
    relativeCssFontPath: '../fonts/',
    className: 'icon',
    cssTemplatePath: 'templates/font.css',
    fontDestPath: 'fonts/',
    cssDestPath: 'css/'
};

gulp.task('default', ['iconfont']);

gulp.task('iconfont', function(done) {

    var iconStream = gulp.src(config.iconSourcePath)
        .pipe(iconfont({
            fontName: config.fontName,
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff','woff2', 'svg'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp // recommended to get consistent builds when watching files
        }));

    async.parallel([
        function handleGlyphs (cb) {
            iconStream.on('glyphs', function(glyphs, options) {
                gulp.src(config.cssTemplatePath)
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs,
                        fontName: config.fontName,
                        fontPath: config.relativeCssFontPath,
                        className: config.className
                    }))
                    .pipe(gulp.dest(config.cssDestPath))
                    .on('finish', cb);
            });
        },
        function handleFonts (cb) {
            iconStream
                .pipe(gulp.dest(config.fontDestPath))
                .on('finish', cb);
        }
    ], done);
});
