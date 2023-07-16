<h2 align="center"><a name="readme"></a>
  <img src="icon128.png" width="32" height="32" alt="Icon" />
  Shortcut Forwarding Tool
</h2>

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.txt)
![Version 1.1.0](https://img.shields.io/badge/release-1.1.0-orange.svg)
**Visit on [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/shortcut-forwarding-tool/)** /
**[Chrome Web Store](
  https://chrome.google.com/webstore/detail/shortcut-forwarding-tool/clnalilglegcjmlgenoppklmfppddien
  )**

This web extension provides 32 global shortcut placeholders,
and it will forward all shortcut messages to another (configurable) extension.

[阅读中文介绍](README_zh.md)（description in Chinese）。

The common usage of this extension is to forward all shortcuts to [Vimium C - All by Keyboard](
  https://github.com/gdh1995/vimium-c),
and then you may trigger Vimium C's tens of commands easily, without taking care of what modes you're currently in.

For example, if you:
* specify <kbd>Alt+Shift+H</kbd> for "Custom Shortcut 1" in the shortcut settings page (chrome://extensions/shortcuts),
* and add `shortcut userCustomized1 command="showHelp"` to Vimium C's custom key mappings,
* then you'll be able to trigger Vimium C's help panel by <kbd>Alt+Shift+H</kbd>,
  even when a text box or Vomnibar is showing and focused.

Please note that, if you have modified some options of Vimium C, you may need to add this extension id
  (clnalilglegcjmlgenoppklmfppddien, on MS Edge and Chrome) to Vimium C's "Allow list of other extension IDs" settings.

# Release Notes

1.1.0:
* add Chinese UI
* fix found bugs

0.1.0:
* a base version fixing lots of bugs

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
* The arrow at bottom right corner in icon is based on an icon designed by dAKirby309
    from http://www.iconarchive.com/show/simply-styled-icons-by-dakirby309/Shortcuts-icon.html
