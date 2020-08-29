PDF Viewer for Vimium C is a PDF Viewer supporting Vimium C shortcuts, and published on Chrome Web Store.

This folder stores diff files between the building files of standard PDF.js and PDF Viewer for Vimium C.

### Commit date

The `build.diff` is created from the https://github.com/mozilla/pdf.js/commit/eb3654e278c010f3b83dbfe4d69fcc49d41c97b5 .

### Build steps

``` bash
# cd pdf.js
npm ci
gulp chromium
cd build-my
rm -rf chromium && cp -a ../build/chromium chromium
# apply build.diff to chromium
rm -rf dist && cp -a chromium dist
./minify.js
```
