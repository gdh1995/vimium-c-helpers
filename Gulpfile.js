"use strict";

var fs = require("fs");
var gulp = require("gulp");
var newer = require('gulp-newer');
var gulpPrint = require('gulp-print');
var logger = require("fancy-log");
var osPath = require('path');
try {
  var { readJSON, readFile } = require("../scripts/dependencies");
} catch {
  var { readJSON, readFile } = require("../vimium-c/scripts/dependencies");
}


var DEST = "../dist/helpers";
var SOURCES = ["newtab", "shortcuts"];
var IS_FIREFOX = process.env.BUILD_BTypes === "2";

gulpPrint = gulpPrint.default || gulpPrint;
if (!fs.existsSync(DEST)) {
  fs.mkdirSync(DEST);
}

gulp.task("static", function() {
  var path = SOURCES.map(i => i + "/*").concat([
    "**/_locales/**"
    , "!**/manifest*.json"
    , "!**/*.log", "!**/*.psd", "!**/*.zip", "!**/*.tar", "!**/*.tgz", "!**/*.gz"
    , '!**/*.ts', "!**/tsconfig*.json"
    , "!test*", "!todo*"
  ]);
  if (IS_FIREFOX) {
    path = path.concat(["!**/_locales/*_*/**"]);
    var rimraf = require("rimraf");
    rimraf.sync(DEST + "/**/_locales/*_*/*.json");
  }
  return gulp.src(path, { base: "." })
      .pipe(newer(DEST))
      .pipe(gulpPrint())
      .pipe(gulp.dest(DEST));
});

gulp.task("manifest", function(cb) {
  for (var i of SOURCES) {
    translateManifest(i + "/manifest.json");
  }
  cb();
});

function translateManifest(srcPath) {
  var manifest = readJSON(srcPath, true);
  if (IS_FIREFOX) {
  if (manifest.background) {
    delete manifest.background.persistent;
  }
  delete manifest.minimum_chrome_version;
  delete manifest.key;
  delete manifest.options_page;
  delete manifest.update_url;
  var specific = manifest.browser_specific_settings || (manifest.browser_specific_settings = {});
  var gecko = specific.gecko || (specific.gecko = {});
  var name = manifest.name;
  var i18n_cache = null;
  name = name.replace(/__MSG_(\w+)__/, function (_, key) {
    if (!i18n_cache) {
      i18n_cache = readJSON(srcPath.replace("manifest.json", `_locales/${manifest.default_locale}/messages.json`));
    }
    return i18n_cache[key].message;
  });
  gecko.id = name.replace(/ /g, "-").toLowerCase();
  gecko.id += "@gdh1995.cn";
  gecko.strict_min_version = "63.0";
  var permissions = manifest.permissions
    , ind = permissions ? permissions.indexOf("chrome://favicon/") : -1;
  if (ind >= 0) {
    permissions.splice(ind, 1);
  }
  permissions && permissions.length <= 0 && delete manifest.permissions;
  var csp = manifest.content_security_policy;
  if (csp) {
    manifest.content_security_policy = csp.replace(/ ?chrome-extension:\/\/[\w\/\-\_@]*/gi, "");
  }
  }

  var keys = Object.keys(manifest);
  keys.sort();
  var m2 = {};
  for (var key of keys) {
    m2[key] = manifest[key];
  }
  manifest = m2;
  var file = osPath.join(DEST, srcPath), data = JSON.stringify(manifest, null, "  ");
  var folder = file.replace(/[\/\\][^\/\\]*$/, "");
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    var oldData = readFile(file);
    if (data === oldData) {
      return;
    }
  }
  fs.writeFileSync(file, data);
  logger(srcPath);
}
  
var allTasks = gulp.parallel("static", "manifest");
var createGulpTask = function (isFirefox) {
  return function (cb) {
    IS_FIREFOX = isFirefox;
    return allTasks(cb);
  }
}
gulp.task("ff", createGulpTask(true));
gulp.task("fx", createGulpTask(true));
gulp.task("cr", createGulpTask(false));
gulp.task("firefox", createGulpTask(true));
gulp.task("chrome", createGulpTask(false));
gulp.task("chromium", createGulpTask(false));
gulp.task("default", allTasks);
