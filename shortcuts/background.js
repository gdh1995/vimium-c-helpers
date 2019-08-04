var OnOther = "undefined" === typeof browser || null == (browser && browser.runtime)
    || location.protocol.lastIndexOf("chrome", 0) >= 0 ? 1 /* Chrome */ : 2 /* Firefox */;
var VimiumCId = OnOther === 1 ? "hfjbmagddngcpeloejdejnfgbamkjaeg" : "vimium-c@gdh1995.cn";
if (OnOther !== 1) {
  window.chrome = browser;
}

var targetExtensionId = localStorage.targetExtensionId || VimiumCId;
chrome.commands.onCommand.addListener(function (command) {
  chrome.runtime.sendMessage(targetExtensionId, {
    handler: "shortcut", shortcut: command
  });
});
