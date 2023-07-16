"use strict";
var isNotChrome_ = "object" === typeof browser && !!browser,
focusContent_ = "0" !== localStorage.focusNewTabContent, url_ = localStorage.newTabUrl || "newtab.html",
isRedirecting_ = url_ !== location.href && url_.replace(/^\/?/, "/") !== location.pathname
    || focusContent_ && (url_ += "#content", !location.hash),
useLocation_ = isRedirecting_ && !focusContent_ && /^(file|ftp|https?):/i.test(url_),
extensionInjector_ = localStorage.interactWithExtension !== "0" && localStorage.targetExtensionInjector,
useOpener_ = focusContent_ && localStorage.setOpener, // isNotChrome_ && localStorage.setOpener
extId_ = localStorage.targetExtensionId || (isNotChrome_ ? "vimium-c@gdh1995.cn"
    : /\sEdg\//.test(navigator.appVersion) ? "aibcglbfblnogfjhbcmmpobjhnomhcdo" : "hfjbmagddngcpeloejdejnfgbamkjaeg"),
loadExtension_ = function () {
  var lang = navigator.language;
  if (lang.lastIndexOf("en", 0) < 0) {
    var trans = chrome_.i18n.getMessage;
    document.title = trans("title");
    document.documentElement.lang = trans("lang1");;
  }
  if (!extensionInjector_) { return; }
  var script = document.createElement("script");
  script.src = extensionInjector_;
  script.dataset.extensionId = extId_;
  document.head.appendChild(script);
},
chrome_ = window.chrome || browser,
callback_ = isNotChrome_ ? function (selfTab) {
  var error = chrome_.runtime.lastError;
  if (error) {
    console.log("%o", error);
    loadExtension_();
    return error;
  }
  if (focusContent_) {
    if (selfTab) {
      chrome_.tabs.remove(selfTab.id)
    } else {
      setTimeout(function () { close(); }, 0);
    }
    extensionInjector_ && chrome_.runtime.connect(extId_, { name: "vimium-c.999" });
  }
} : void 0,
useSelfTab_ = function (tabs) {
  var selfTab = tabs && tabs.length > 0 ? tabs[0] : null;
  chrome_.tabs[focusContent_ ? "create" : "update"](!selfTab ? { url: url_ }
      : { url: url_, openerTabId: selfTab.id, index: selfTab.index + 1 },
      callback_ && callback_.bind(null, selfTab));
  isNotChrome_ || focusContent_ && close();
  return chrome_.runtime.lastError;
};

!isRedirecting_ ? loadExtension_()
: useOpener_ ? chrome_.tabs.query({currentWindow: true, active: true}, useSelfTab_)
: useLocation_ ? document.location.href = url_ : useSelfTab_([])
