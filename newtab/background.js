"use strict";

var OnOther = "undefined" === typeof browser || null == (browser && browser.runtime)
    || location.protocol.lastIndexOf("chrome", 0) >= 0 ? 1 /* Chrome */ : 2 /* Firefox */;
var VimiumCId = OnOther === 1 ? "hfjbmagddngcpeloejdejnfgbamkjaeg" : "vimium-c@gdh1995.cn";
if (OnOther !== 1) {
  window.chrome = browser;
}
var DefaultNewTab = "newtab.html";
var DefaultFocusNewTabContent = "1";
var DefaultInteractWithExtension = "1";

var interactWithExtension = (localStorage.interactWithExtension || DefaultInteractWithExtension) !== "0";
var targetExtensionId = localStorage.targetExtensionId || VimiumCId;

chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
  if (!interactWithExtension || sender.id !== targetExtensionId) { // refuse
    sendResponse(false);
    return;
  }
  if (message.handler === "setup") {
    localStorage.newTabUrl = message.newTabUrl || DefaultNewTab;
    localStorage.focusNewTabContent = message.focusNewTabContent ? "1" : "0";
    if (!localStorage.targetExtensionInjector) {
      localStorage.targetExtensionInjector = chrome.runtime.getURL("/lib/injector.js"
          ).replace(location.host, message.injectionHost || targetExtensionId);
    }
    sendResponse(true);
  } else {
    sendResponse("pong:NewTabAdapter");
  }
});

window.setInteractWithExtension = function (newInteract) {
  interactWithExtension = newInteract;
};

console.log("This background process is helpful for faster opening and less CPU cost,\n\
\tthough at the cost of a little system memory.");
