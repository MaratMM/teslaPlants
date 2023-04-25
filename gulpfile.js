/** НЕ ЗАБУДЬ ДОБАВИТЬ В SKRIPT.JS ИСХОДНИКА
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    
    testWebP(function (support) {
    
    if (support == true) {
    document.querySelector('body').classList.add('webp');
    }else{
    document.querySelector('body').classList.add('no-webp');
    }
    });
 */
    // for Node.js v14.17.6.

    
    const fileinclude = require('gulp-file-include');
    const scss = require('gulp-sass')(require('sass'));/* Для исправления ошибки установите сначала пакет sass через команду npm i sass —save-dev Дальше в gulpfile измените аналогичную строку на 
    const sass        = require('gulp-sass')(require('sass'));*/
    
    let project_folder="dist"; //require("path").basename(__dirname); если присвоить переменной это значение изменится название папки куда мы все выплелвываем и отдаем заказчику
    let sourse_folder="#src";
    
    let fs=require('fs');
    
    let path= {
        build:{
            html: project_folder+"/",
            css: project_folder+"/css/",
            js: project_folder+"/js/",
            img: project_folder+"/img/",
            fonts: project_folder+"/fonts/",
        },
        src:{
            html: [sourse_folder+"/*.html", "!"+sourse_folder+"/_*.html"],
            css: sourse_folder+"/scss/style.scss",
            js: sourse_folder+"/js/script.js",
            img: sourse_folder+"/img/**/*.{jpg,png,svg,gif,ico,webp}",
            fonts: sourse_folder+"/fonts/*.ttf",
        },
        watch:{
            html: sourse_folder+"/**/*.html",
            css: sourse_folder+"/scss/**/*.scss",
            js: sourse_folder+"/js/**/*.js",
            img: sourse_folder+"/img/**/*.{jpg,png,svg,gif,ico,webp}",
        },
        clean: "./"+project_folder+"/"
    }
    
    let {src, dest}= require('gulp'),
    gulp=require('gulp'),
    browsersync=require("browser-sync").create(),
    autoprefixer=require("gulp-autoprefixer"),
    group_media=require("gulp-group-css-media-queries"),
    clean_css=require("gulp-clean-css"),
    rename=require("gulp-rename"),
    uglify=require("gulp-uglify-es").default,
    imagemin=require("gulp-imagemin"),
    webp=require("gulp-webp"),
    webphtml=require("gulp-webp-html"),
    webpcss=require("gulp-webpcss"),
    svgSprite=require("gulp-svg-sprite"),
    ttf2woff=require("gulp-ttf2woff"),
    ttf2woff2=require("gulp-ttf2woff2"),
    fonter=require("gulp-fonter"),
    del=require("del");
    //scss=require("gulp-sass"); см в начале файле комментарий
    //fileinclude = require("gulp-file-include"); не надо потому что сама себя объявила первой строке
    
    
    function browserSync(params) {
        browsersync.init({
            server:{
                baseDir: "./"+project_folder+"/"
            },
            port:3000,
            notify:false
        })
    }
    
    function html() {
        return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
    }
    
    function css() {
        return src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 version"],
                cascade: true
            })
        )
        .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
    }
    
    function js() {
        return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
    }
    
    function images() {
        return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3 // 0 to 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
    }
    
    function fonts() {
        src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
        return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
    }
    
    gulp.task('otf2ttf', function(){
        return src([sourse_folder+'/fonts/*.otf'])
        .pipe(fonter({
            formats: [ttf]
        }))
        .pipe(dest(sourse_folder+'/fonts/'));
    })
    
    //вызвать gulp svgSprite в консоли
    gulp.task('svgSprite', function(){
        return gulp.src([sourse_folder+'/iconsprite/*.svg'])
        .pipe(svgSprite({
            mode: {
                stack:{
                    sprite: "../icons/icons.svg", //sprite file name
                    example: true  
                }  
            },
        }
        ))
        .pipe(dest(path.build.img))
    })
    
    function fontsStyle(params) {
    
        let file_content = fs.readFileSync(sourse_folder + '/scss/fonts.scss');
        if (file_content == '') {
        fs.writeFile(sourse_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
        if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
        let fontname = items[i].split('.');
        fontname = fontname[0];
        if (c_fontname != fontname) {
        fs.appendFile(sourse_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
        }
        c_fontname = fontname;
        }
        }
        })
        }
        }
        
        function cb() { }
    
    function watchFiles(params) {
        gulp.watch([path.watch.html], html);
        gulp.watch([path.watch.css], css);
        gulp.watch([path.watch.js], js);
        gulp.watch([path.watch.img], images);
    }
    
    function clean(params) {
        return del(path.clean);
    }
    
    let build=gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
    let watch=gulp.parallel(build, watchFiles, browserSync);
    
    exports.fontsStyle=fontsStyle;
    exports.fonts=fonts;
    exports.images=images;
    exports.js=js;
    exports.css=css;
    exports.build=build;
    exports.html=html;
    exports.watch=watch;
    exports.default=watch;