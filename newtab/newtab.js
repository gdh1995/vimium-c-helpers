"use strict";
var isNotChrome_ = "object" === typeof browser && !!browser,
focusContent_ = "0" !== localStorage.focusNewTabContent, url_ = localStorage.newTabUrl || "newtab.html",
isRedirecting_ = url_ !== location.href && url_.replace("/", "") !== location.pathname.replace("/", ""),
useLocation_ = isRedirecting_ && !focusContent_ && /^(file|ftp|https?):/i.test(url_),
extensionInjector_ = localStorage.interactWithExtension !== "0"  && localStorage.targetExtensionInjector,
extId = localStorage.targetExtensionId || (isNotChrome_ ? "vimium-c@gdh1995.cn" : "hfjbmagddngcpeloejdejnfgbamkjaeg"),
loadExtension_ = function () { if (!extensionInjector_) { return; }
  var script = document.createElement("script");
  script.src = extensionInjector_;
  script.dataset.extensionId = extId;
  document.head.appendChild(script);
}, chrome_ = window.chrome || browser;

isRedirecting_ ? useLocation_ ? (document.location.href = url_) : chrome_.tabs[focusContent_ ? "create" : "update"]({
  url: url_
}, isNotChrome_ ? function () {
  var error = chrome_.runtime.lastError;
  if (error) {
    console.log("%o", error);
    loadExtension_();
    return error;
  }
  focusContent_ && chrome.tabs.getCurrent(function (tab) { tab && tab.id && chrome.tabs.remove(tab.id); });
  focusContent_ && extensionInjector_ && chrome_.runtime.connect(extId, { name: "vimium-c.999" }
  );
} : void 0) : loadExtension_();

!isNotChrome_ && focusContent_ && isRedirecting_ && close();
