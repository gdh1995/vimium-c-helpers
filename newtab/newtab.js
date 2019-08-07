"use strict";
var isNotChrome_ = "object" === typeof browser && !!browser,
focusContent_ = "0" !== localStorage.focusNewTabContent, url_ = localStorage.newTabUrl || "newtab.html",
isRedirecting_ = url_ !== location.href && url_.replace("/", "") !== location.pathname.replace("/", ""),
useLocation_ = isRedirecting_ && !focusContent_ && /^(file|ftp|https?):/i.test(url_),
interactWithVimiumC_ = localStorage.interactWithVimiumC !== "0"  && !!localStorage.vimiumCInjector,
loadVimiumC_ = function () { if (interactWithVimiumC_) { return; }
  var script = document.createElement("script");
  script.src = localStorage.vimiumCInjector;
  document.head.appendChild(script);
}, chrome_ = window.chrome || browser;

isRedirecting_ ? useLocation_ ? (document.location.href = url_) : chrome_.tabs[focusContent_ ? "create" : "update"]({
  url: url_
}, isNotChrome_ ? function () {
  let error = chrome_.runtime.lastError;
  if (error) {
    console.log("%o", error);
    loadVimiumC_();
    return error;
  }
  focusContent_ && chrome.tabs.getCurrent(function (tab) { tab && tab.id && chrome.tabs.remove(tab.id); });
  focusContent_ && interactWithVimiumC_ && chrome_.runtime.connect(localStorage.vimiumCId ||
    (isNotChrome_ ? "vimium-c@gdh1995.cn" : "hfjbmagddngcpeloejdejnfgbamkjaeg"), { name: "vimium-c.999" }
  );
} : void 0) : loadVimiumC_();

!isNotChrome_ && focusContent_ && isRedirecting_ && close();
