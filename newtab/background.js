"use strict";

var OnOther = "undefined" === typeof browser || null == (browser && browser.runtime)
    || location.protocol.lastIndexOf("chrome", 0) >= 0 ? 1 /* Chrome */ : 2 /* Firefox */;
var VimiumCId = OnOther === 1 ? "hfjbmagddngcpeloejdejnfgbamkjaeg" : "vimium-c@gdh1995.cn";
if (OnOther !== 1) {
  window.chrome = browser;
  VimiumCId = localStorage.vimiumCId || vimiumCId;
}
var DefaultNewTab = "newtab.html";
var DefaultFocusNewTabContent = "1";
var DefaultInteractWithVimiumC = "1";

var interactWithVimiumC = (localStorage.interactWithVimiumC || DefaultInteractWithVimiumC) !== "0";

chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
  if (sender.id !== VimiumCId || !interactWithVimiumC) { // refuse
    sendResponse(false);
    return;
  }
  if (message.handler === "setup") {
    localStorage.newTabUrl = message.newTabUrl || DefaultNewTab;
    localStorage.focusNewTabContent = message.focusNewTabContent ? "1" : "0";
    if (!localStorage.vimiumCInjector) {
      localStorage.vimiumCInjector = chrome.runtime.getURL("/lib/injector.js"
          ).replace(location.host, OnOther !== 1 ? message.vimiumCHost : VimiumCId);
    }
    sendResponse(true);
  } else {
    sendResponse("pong");
  }
});

window.setInteractWithVimiumC = function (newInteract) {
  interactWithVimiumC = newInteract;
};

console.log("This background process is helpful for faster opening and less CPU cost,\n\
\tthough at the cost of a little system memory.");
