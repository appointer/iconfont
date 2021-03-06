var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now() / 1000);
var gulp = require('gulp');
var consolidate = require('gulp-consolidate');
var async = require('async');
var _ = require('lodash');
var sass = require('gulp-sass');

var config = {
    iconSourcePath: ['icons/*.svg'],
    fontName: 'appointer-icon',
    relativeCssFontPath: '../fonts/',
    className: 'icon',
    scssTemplatePath: 'templates/**/*.scss',
    fontDestPath: 'fonts/',
    scssDestPath: 'sass/includes/'
};

const escapeUnicodes = function (glyphs) {
    return _.map(glyphs, function (glyph) {
        glyph.escapedUnicode = _.map(glyph.unicode, function (unicode) {
            return toUnicodeSequence(unicode);
        });
        return glyph;
    });
};

const toUnicodeSequence = function (str) {
    for (var i = str.length; i--;) {
        str = str.slice(0, i) + '\\u'
            + ('000' + str.charCodeAt(i).toString(16)).slice(-4)
            + str.slice(i + 1);
    }
    return str;
};

gulp.task('default', ['iconfont','sass']);

gulp.task('iconfont', function (done) {

    var iconStream = gulp.src(config.iconSourcePath)
        .pipe(iconfont({
            fontName: config.fontName,
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'], // default, 'woff2' and 'svg' are available
            timestamp: runTimestamp // recommended to get consistent builds when watching files
        }));

    async.parallel([
        function (cb) {
            iconStream.on('glyphs', function (glyphs, options) {
                gulp.src(config.scssTemplatePath)
                    .pipe(consolidate('lodash', {
                        glyphs: escapeUnicodes(glyphs),
                        fontName: config.fontName,
                        fontPath: config.relativeCssFontPath,
                        className: config.className
                    }))
                    .pipe(gulp.dest(config.scssDestPath))
                    .on('finish', cb);
            });
        },
        function (cb) {
            iconStream
                .pipe(gulp.dest(config.fontDestPath))
                .on('finish', cb);
        }
    ], done);
});

gulp.task('sass', function () {
    return gulp.src('./sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});
