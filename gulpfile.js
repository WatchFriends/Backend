var gulp = require("gulp"),
    htmlhint = require("gulp-htmlhint"),
    csslint = require("gulp-csslint"),
    jshint = require("gulp-jshint"),
    tslint = require("gulp-tslint"),
    sass = require("gulp-sass"),
    watch = require("gulp-watch");

var paths = {
    html: "./frontend/**/*.html",
    scss: "./frontend/**/*.scss",
    css: "./frontend/**/*.css",
    ts: "./frontend/**/*.ts",
    js: "./frontend/**/*.js",
    node: "./backend/**/*.js"
};

gulp.task("default", () => {
    var eventlogger = event => console.log('File ${event.path} was ${event.type}');
    var html = gulp.watch(paths.html, ["html"]),
        scss = gulp.watch(paths.scss, ["scss"]),
        css = gulp.watch(paths.css, ["css"]),
        ts = gulp.watch(paths.ts, ["ts"]),
        js = gulp.watch(paths.js, ["js"]),
        node = gulp.watch(paths.node, ["node"]);
    html.on('change', eventlogger);
    scss.on('change', eventlogger);
    css.on('change', eventlogger);
    ts.on('change', eventlogger);
    js.on('change', eventlogger);
    node.on('change', eventlogger);
});

gulp.task("html", () => 
    gulp.src(paths.html)
        .pipe(htmlhint(".htmlhintrc"))
        .pipe(htmlhint.reporter("htmlhint-stylish"))
        .pipe(htmlhint.failReporter())
);

gulp.task("scss", () => 
    gulp.src(paths.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(csslint())
        .pipe(csslint.formatter())
);

gulp.task("css", () => 
    gulp.src(paths.css)
        .pipe(csslint())
        .pipe(csslint.formatter())
);

gulp.task("ts", () => 
    gulp.src(paths.ts)
        .pipe(tslint())
);

var jsreporter = jshint.reporter("jshint-stylish", { verbose: true });

gulp.task("js", () => 
    gulp.src(paths.js)  
        .pipe(jshint())
        .pipe(jsreporter)
);

gulp.task("node", () => 
    gulp.src(paths.node)
        .pipe(jshint({esnext:true}))
        .pipe(jsreporter)
);