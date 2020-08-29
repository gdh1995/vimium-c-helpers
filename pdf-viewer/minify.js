#!/usr/bin/env node
"use strict";

var fs = require("fs");
var path = require("path");

var SOURCE_DIR = "chromium";
var MINIFIED_DIR = "dist";

var cwd = process.cwd();
if (cwd.endsWith(MINIFIED_DIR) || cwd.endsWith(SOURCE_DIR)) {
  process.chdir("..");
} else if (!fs.existsSync(cwd + path.sep + MINIFIED_DIR)) {
  process.chdir(path.dirname(path.resolve(process.argv[1])));
}
MINIFIED_DIR += path.sep + "content";
SOURCE_DIR += path.sep + "content";

var pdfFile = fs.readFileSync(SOURCE_DIR + "/build/pdf.js").toString();
var pdfWorkerFile = fs.readFileSync(SOURCE_DIR + "/build/pdf.worker.js")
  .toString();
var viewerFiles = {
  "viewer.js": fs.readFileSync(SOURCE_DIR + "/web/viewer.js").toString(),
};
var vimiumCInjectorFiles = {
  "vimium-c-injector.js": fs.readFileSync(SOURCE_DIR + "/web/vimium-c-injector.js").toString(),
};

console.log("### Minifying js files");

var Terser = require("terser");
// V8 chokes on very long sequences. Works around that.
var optsForHugeFile = { compress: { sequences: false } };

fs.writeFileSync(
  MINIFIED_DIR + "/web/viewer.js",
  Terser.minify(viewerFiles).code
);
fs.writeFileSync(
  MINIFIED_DIR + "/web/vimium-c-injector.js",
  Terser.minify(vimiumCInjectorFiles).code
);
fs.writeFileSync(
  MINIFIED_DIR + "/build/pdf.js",
  Terser.minify(pdfFile).code
);
fs.writeFileSync(
  MINIFIED_DIR + "/build/pdf.worker.js",
  Terser.minify(pdfWorkerFile, optsForHugeFile).code
);

console.log("Done.");
