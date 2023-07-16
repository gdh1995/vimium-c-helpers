<h2 align="center"><a name="readme"></a>
  <img src="icon128.png" width="32" height="32" alt="Icon" />
  NewTab Adapter
</h2>

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.txt)
![Version 1.3.0](https://img.shields.io/badge/release-1.3.0-orange.svg)
**Visit on [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/newtab-adapter/)** /
**[Chrome Web Store](
  https://chrome.google.com/webstore/detail/newtab-adapter/cglpcedifkgalfdklahhcchnjepcckfn
  )**

This web extension takes over your browser's new tab settings,
and it can move the focus of a new tab from address bar to page content.

This extension runs [Vimium C - All by Keyboard](
  https://github.com/gdh1995/vimium-c)'s content scripts on its newtab page by default,
while this feature can be disabled by an advanced option.

[阅读中文介绍](README_zh.md)（description in Chinese）。

# Release Notes

1.3.0:
* Firefox: add an option of "Open target URL in a same container (group)" to let it work with Simple Tab Groups

1.2.0:
* add Chinese UI
* now can change ID of the target extension to inject
* fix some bugs

1.0.0:
* fix [#1](https://github.com/gdh1995/vimium-c-helpers/issues/1) and update inner Vomnibar page

0.1.0:
* a base version, fixing bugs and adding a Vomnibar page

# Related Project

__<span style="color: #2f508e;">Vim</span>ium <span style="color: #a55e18;">C</span>:__

* a web extension for MS Edge, Firefox and Chrome that provides keyboard-based navigation and control
    of the web, in the spirit of the Vim editor.
* add some powerful functions and provide more configurable details and convenience.
* its homepage is https://github.com/gdh1995/vimium-c and https://gitee.com/gdh1995/vimium-c
* here is its [license](https://github.com/gdh1995/vimium-c/blob/master/LICENSE.txt)
  and [privacy policy](https://github.com/gdh1995/vimium-c/blob/master/PRIVACY-POLICY.md)
* the initial code is forked from [philc/vimium:master](https://github.com/philc/vimium) on 2014.
* customized after translating it from CoffeeScript into JavaScript and then TypeScript.

# Thanks & Licenses

This project: Copyright (c) Gong Dahan.
See the [MIT license](LICENSE.txt) for details.

* [Vimium C - All by Keyboard](https://github.com/gdh1995/vimium-c):
  Copyright (c) 2014-2023 Gong Dahan, Phil Crosby, Ilya Sukhar.
  It's `MIT-licensed-v1` branch is [MIT-licensed](https://github.com/gdh1995/vimium-c/blob/master/LICENSE.txt).
* The orange in icon is from https://pixabay.com/vectors/orange-fruit-mandarin-citrus-fruit-158258/
