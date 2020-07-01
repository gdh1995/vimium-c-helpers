"use strict";

var OnOther = "undefined" === typeof browser || null == (browser && browser.runtime)
    || location.protocol.lastIndexOf("chrome", 0) >= 0 ? 1 /* Chrome */ : 2 /* Firefox */;
var IsEdg_ = OnOther === /* Chrome */ 1 && /\sEdg\//.test(navigator.appVersion);
var VimiumCId = OnOther === 1 ? IsEdg_ ? "aibcglbfblnogfjhbcmmpobjhnomhcdo" : "hfjbmagddngcpeloejdejnfgbamkjaeg"
    : "vimium-c@gdh1995.cn";
if (OnOther !== 1) {
  window.chrome = browser;
}
var DefaultKeepAliveTime = 120;

var targetExtensionId = localStorage.targetExtensionId || VimiumCId;
var useKeepAlive = !!localStorage.useKeepAlive;
var keepAliveTime = useKeepAlive
    ? BG && BG.keepAliveTime
      || (localStorage.keepAliveTime ? +localStorage.keepAliveTime : DefaultKeepAliveTime)
    : 0;
if (isNaN(keepAliveTime) || !isFinite(keepAliveTime) || keepAliveTime < 0) {
  keepAliveTime = keepAliveTime === -1 ? 0 : DefaultKeepAliveTime;
}
var aliveTimer = 0;
chrome.commands.onCommand.addListener(function (command) {
  if (command.lastIndexOf("userCustomized0", 0) === 0) {
    command = command.replace("0", "");
  }
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
