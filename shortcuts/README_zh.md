<h2 align="center"><a name="readme"></a>
  <img src="icon128.png" width="32" height="32" alt="图标" />
  快捷键补充工具
</h2>

[![MIT 许可协议](https://img.shields.io/badge/许可协议-MIT-blue.svg)](LICENSE.txt)
![版本 1.1.0](https://img.shields.io/badge/release-1.1.0-orange.svg)
在 **[Firefox 附加组件](https://addons.mozilla.org/firefox/addon/shortcut-forwarding-tool/)** /
**[Chrome 网上应用店](
  https://chrome.google.com/webstore/detail/shortcut-forwarding-tool/clnalilglegcjmlgenoppklmfppddien
  )** 中查看

本项目是一款开源、免费的快捷键增强类浏览器扩展，提供了 32 个全局快捷键位置，用户触发后它会将快捷键消息转发给指定的另一扩展程序。

[Here's its description in English](README.md)（点击查看英文介绍）。

#### 主要功能

本扩展可用于转发其所有快捷键命令到 [Vimium C - 全键盘操作浏览器](https://gitee.com/gdh1995/vimium-c)。
您可以在 Vimium C 中进一步设置各快捷键对应的命令，它们将以最高优先级来执行。

例如，如果在浏览器的“键盘快捷方式”页（比如 chrome://extensions/shortcuts）为“第 1 号快捷键”绑定 <kbd>Alt+Shift+H</kbd>，
并在 Vimium C 的“自定义快捷键”选项中添加 `shortcut userCustomized1 command="showHelp"`，
那么您按下 <kbd>Alt+Shift+H</kbd> 后 Vimium C 将显示其帮助对话框，即使当前键盘焦点在文本框或 Vomnibar 上也是如此。

请注意，如果您修改过 Vimium C 的某些配置，您也许需要手动添加本扩展的 ID（在 微软 Edge 和 谷歌 Chrome 上是
clnalilglegcjmlgenoppklmfppddien）到 Vimium C 的“受信任的其它扩展”列表中。

#### 开发与维护

本项目主要由 [gdh1995](https://github.com/gdh1995) 开发并维护，并且以 [MIT 许可协议](LICENSE.txt) 开源。

本项目的主仓库是 https://github.com/gdh1995/vimium-c-helpers 和 https://gitee.com/gdh1995/vimium-c-helpers 。
