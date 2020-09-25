PDF Viewer for Vimium C is a PDF Viewer supporting Vimium C shortcuts, and published on Chrome Web Store.

This folder stores parts of those diff files between the building files of standard PDF.js and PDF Viewer for Vimium C.

### Code difference

The code used to build is published on https://github.com/gdh1995/pdf.js/tree/master .

### Build steps

``` bash
# cd pdf.js
npm ci
gulp chromium
cd build-my
rm -rf chromium && cp -a ../build/chromium chromium
# copy these modified icon files to the "chromium/"
rm -rf dist && cp -a chromium dist
./minify.js
```
