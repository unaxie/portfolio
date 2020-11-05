var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    mainBowerFiles = require('main-bower-files'),
    browserSync = require('browser-sync'),
    autoprefixer = require('autoprefixer'),
    ghPages = require('gulp-gh-pages'),
    pngquant = require('imagemin-pngquant'),
    jpegoptim = require('imagemin-jpegoptim');

var minimist = require('minimist'); // 用來讀取指令轉成變數
var gulpSequence = require('gulp-sequence').use(gulp);

var path = {
    source: './source/',
    public: './public/',
    bower: './bower_components/'
}

// production || development
// # gulp --env production
var envOptions = {
    string: 'env',
    default: {
        env: 'development'
    }
};
var options = minimist(process.argv.slice(2), envOptions);
console.log(options);

gulp.task('clean', function () {
    return gulp.src(path.public, {
        read: false
    }) // 選項讀取：false阻止gulp讀取文件的內容，使此任務更快。
        .pipe($.clean());
    cb(err)
});

gulp.task('pug', function () {
    return gulp.src(path.source + 'pug/**/*.pug')
        .pipe($.changed(path.public, {
            extension: '.html'
        }))
        .pipe($.plumber({
            errorHandler: $.notify.onError("pug compile error")
        }))
        .pipe($.pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.public))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'pug compile success'
        }));
});

gulp.task('cleanPugTmpl', ['pug'], function () {
    del([path.public + '**/layout/']);
    browserSync.reload();
});

gulp.task('scripts', function () {
    return gulp.src([path.source + '**/*.js', '!node_modules/**'])
        .pipe($.plumber({
            errorHandler: $.notify.onError("js compile error")
        }))
        .pipe(gulp.dest(path.public))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'js compile success'
        }));
});

gulp.task('sass', function () {
    var processors = [
        autoprefixer({
            browsers: ['last 5 versions']
        })
    ];
    return gulp.src([path.source + 'scss/**/*.scss', path.source + 'scss/**/*.sass'])
        .pipe($.plumber({
            errorHandler: $.notify.onError("sass compile error")
        }))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            outputStyle: 'nested'
            // outputStyle: 'compressed'
        }).on('error', $.sass.logError))
        .pipe($.postcss(processors))
        .pipe($.if(options.env === 'production', $.minifyCss())) // 假設開發環境則壓縮 CSS
        .pipe($.sourcemaps.write('./maps'))
        .pipe(gulp.dest(path.public + 'css/'))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'sass compile success'
        }));
});


gulp.task('cleanSassMaps', ['sass'], function () {
    del([path.public + 'css/maps']);
    browserSync.reload();

});

gulp.task('imageCompress', function () {
    gulp.src(path.source + '**/images/**/*')
        .pipe($.newer(path.public))
        .pipe($.imagemin({
            progressive: true,
            use: [pngquant(), jpegoptim({
                size: "60%"
            })]
        }))
        .pipe($.size({
            showFiles: true,
            pretty: true
        }))
        .pipe(gulp.dest(path.public))
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe($.notify({
            message: 'image compressed success'
        }));
});

gulp.task('plugin', function () {
    gulp.src(path.source + 'plugin/**/*')
        .pipe(gulp.dest(path.public + 'plugin/'));
});

gulp.task('fonts', function () {
    gulp.src(path.source + 'fonts/**/*')
        .pipe(gulp.dest(path.public + 'fonts/'));
});

gulp.task('deploy', function () {
    return gulp.src(path.public + '**/*')
        .pipe(ghPages());
});

gulp.task('otherFiles', function () {
    gulp.src([path.source + 'CNAME'])
        .pipe(gulp.dest(path.public));
})

gulp.task('browserSync', function () {
    browserSync.init({
        server: path.public,
        port: 3003
    })
});

gulp.task('watch', function () {
    gulp.watch(path.source + '**/*.pug', ['pug']);
    gulp.watch(path.source + '**/*.pug', ['cleanPugTmpl']);
    gulp.watch(path.source + '**/*.+(scss|sass)', ['sass']);
    gulp.watch(path.source + './maps', ['cleanSassMaps']);
    gulp.watch(path.source + 'plugin/**/*', ['plugin']);
    gulp.watch(path.source + '**/*.js', ['scripts']);
    gulp.watch(path.source + '**/images/**/*', ['imageCompress']);
    gulp.watch(path.source + 'fonts/**/*', ['fonts']);
});

gulp.task('sequence', gulpSequence('clean', 'pug', 'cleanPugTmpl', 'sass', 'cleanSassMaps', 'scripts', 'plugin', 'imageCompress'));

gulp.task('default', ['pug', 'cleanPugTmpl', 'sass', 'cleanSassMaps', 'scripts', 'plugin', 'imageCompress', 'browserSync', 'fonts', 'watch', 'otherFiles','deploy']);
gulp.task('build', ['sequence'])