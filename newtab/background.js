"use strict";

var OnOther = "undefined" === typeof browser || null == (browser && browser.runtime)
    || location.protocol.lastIndexOf("chrome", 0) >= 0 ? 1 /* Chrome */ : 2 /* Firefox */;
var IsEdg_ = OnOther === /* Chrome */ 1 && /\sEdg\//.test(navigator.appVersion);
var VimiumCId = OnOther === 1 ? IsEdg_ ? "aibcglbfblnogfjhbcmmpobjhnomhcdo" : "hfjbmagddngcpeloejdejnfgbamkjaeg"
    : "vimium-c@gdh1995.cn";
if (OnOther !== 1) {
  window.chrome = browser;
}
var DefaultNewTab = "newtab.html";
var DefaultFocusNewTabContent = "1";
var DefaultInteractWithExtension = "1";

var interactWithExtension = (localStorage.interactWithExtension || DefaultInteractWithExtension) !== "0";
var targetExtensionId = localStorage.targetExtensionId || (localStorage.targetExtensionId = VimiumCId);

var firstInstall = localStorage.hasInstalled !== "1";
setTimeout(function() {
  if (firstInstall) {
    localStorage.hasInstalled = "1";
    var open = chrome.runtime.openOptionsPage;
    open ? open() : chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
  } else if (interactWithExtension && targetExtensionId) {
    var curNewTabUrl = OnOther === 1 ? localStorage.newTabUrl : "";
    if (curNewTabUrl && curNewTabUrl.indexOf(":") >= 0 && curNewTabUrl.lastIndexOf(location.origin, 0) < 0) {
      return;
    }
    chrome.runtime.sendMessage(targetExtensionId, {
      handler: "id"
    }, function (response) {
      var injectable = response && response.name
          && (response != null ? !!response.injector : targetExtensionId === VimiumCId);
      var newInjector = injectable
          ? response.injector || chrome.runtime.getURL("/lib/injector.js").replace(location.host, response.host)
          : "";
      if (localStorage.targetExtensionInjector !== newInjector) {
        console.log('do update');
        localStorage.targetExtensionInjector = newInjector;
      }
      return chrome.runtime.lastError;
    });
  }
}, firstInstall ? 200 : 1000);

chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
  if (!interactWithExtension || sender.id !== targetExtensionId) { // refuse
    sendResponse(false);
    return;
  }
  if (message.handler === "setup") {
    localStorage.newTabUrl = message.newTabUrl || DefaultNewTab;
    localStorage.focusNewTabContent = message.focusNewTabContent ? "1" : "0";
    localStorage.targetExtensionInjector = chrome.runtime.getURL("/lib/injector.js"
        ).replace(location.host, message.injectionHost || targetExtensionId);
    sendResponse(true);
  } else {
    sendResponse("pong:NewTabAdapter");
  }
});

window.setInteractWithExtension = function (newInteract) {
  interactWithExtension = newInteract;
};
window.setTargetExtensionId = function (newID) {
  targetExtensionId = newID || VimiumCId;
};

console.log("This background process is helpful for faster opening and less CPU cost,\n\
\tthough at the cost of a little system memory.");
