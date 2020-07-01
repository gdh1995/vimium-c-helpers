"use strict";
var injector = localStorage.targetExtensionInjector;
if (injector && (localStorage.interactWithExtension || "1") !== "0") {
  var match = /^[^\/]+\/\/[^\/]+\//.exec(injector);
  if (match) {
    var script = document.createElement("script");
    script.dataset.extensionId = localStorage.targetExtensionId
      || (injector[0] === "c"
      ? /\sEdg\//.test(navigator.appVersion) ? "aibcglbfblnogfjhbcmmpobjhnomhcdo" : "hfjbmagddngcpeloejdejnfgbamkjaeg"
      : "vimium-c@gdh1995.cn");
    script.src = match[0] + "front/vomnibar.js";
    document.head.appendChild(script);
  }
}
