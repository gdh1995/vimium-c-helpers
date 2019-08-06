"use strict";

var OnOther = "undefined" === typeof browser || null == (browser && browser.runtime)
    || location.protocol.lastIndexOf("chrome", 0) >= 0 ? 1 /* Chrome */ : 2 /* Firefox */;
var VimiumCId = OnOther === 1 ? "hfjbmagddngcpeloejdejnfgbamkjaeg" : "vimium-c@gdh1995.cn";
var DefaultKeepAliveTime = 120;
if (OnOther !== 1) {
  window.chrome = browser;
}

var targetExtensionId = localStorage.targetExtensionId || VimiumCId;
var keepAliveTime = +localStorage.keepAliveTime || DefaultKeepAliveTime;
var useKeepAlive = !!localStorage.useKeepAlive;
var aliveTimer = 0;
chrome.commands.onCommand.addListener(function (command) {
  chrome.runtime.sendMessage(targetExtensionId, {
    handler: "shortcut", shortcut: command
  }, function () {
    return chrome.runtime.lastError;
  });
  refreshTimer();
});

window.setTargetExtensionId = function (newID) {
  targetExtensionId = newID || VimiumCId;
};

window.setKeepAliveTime = function (newTime) {
  keepAliveTime = newTime;
  refreshTimer();
};

refreshTimer();

function refreshTimer() {
  if (aliveTimer) {
    clearTimeout(aliveTimer);
    aliveTimer = 0;
  }
  if (!useKeepAlive) { return; }
  if (keepAliveTime >= 1) {
    aliveTimer = setTimeout(function () {
      clearTimeout(aliveTimer);
      aliveTimer = 0;
    }, keepAliveTime * 1000);
  }
};
