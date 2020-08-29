"use strict";
(function () {
  var VimiumCHandler = function(code) {
    if (code !== 2) {
      if (code === 3) {
        window.removeEventListener("vimiumMark", onMark, true);
        vsc = api = vsc2 = oldScroll = null;
      }
      return;
    }
    var vsc = window.VSc, api = window.VApi, vsc2 = vsc || api, prop = vsc ? "$sc" : "$"
    var oldScroll = vsc2[prop];
    if (vsc2 && typeof vsc2[prop] === "function") {
      vsc2[prop] = function(element, di, amount) {
        if (element.id === "viewerContainer" && element.classList.contains("pdfPresentationMode")) {
          element.dispatchEvent(new WheelEvent("wheel", {
            bubbles: !0, cancelable: !0, composed: !0,
            deltaY: amount
        }));
        } else {
          oldScroll.call(this, element, di, amount);
        }
      };
    }
    if (api && (api.u + "").lastIndexOf(".href") > 0) {
      api.u = function () {
        return location.href.slice(location.origin.length + 1).split("#", 1)[0];
      };
    }
  };
  var onMark = function (event) {
    var a = event.relatedTarget, str = a && a.textContent, box = a && document.getElementById("viewerContainer");
    if (!box) { return; }
    box.classList.contains("pdfPresentationMode")
    if (!str) { // generate a mark
      a.textContent = [box.scrollLeft, box.scrollTop];
      return;
    } else { // goto a mark
      var mark = str.split(",");
      mark = [~~mark[0], ~~mark[1]];
      if (mark[0] > 0 || mark[1] > 0) {
        box.scrollTo(mark[0], mark[1]);
        a.textContent = "";
        event.preventDefault();
      }
    }
  }

  var injectorURL = localStorage.targetExtensionInjector;
  if (injectorURL === "nul" || injectorURL === "/dev/null") { return; }
  if (!injectorURL) {
    injectorURL = /\sEdg\//.test(navigator.appVersion) ? "aibcglbfblnogfjhbcmmpobjhnomhcdo"
        : "hfjbmagddngcpeloejdejnfgbamkjaeg";
    injectorURL = "chrome-extension://" + injectorURL + "/lib/injector.js";
    localStorage.targetExtensionInjector = injectorURL;
  }
  var script = document.createElement("script");
  script.src = injectorURL;
  script.async = true; script.defer = false;
  script.onload = function () {
    var injector = window.VimiumInjector;
    if (injector && location.pathname.indexOf("://") >= 0) {
      injector.cache ? VimiumCHandler(2, "") : injector.callback = VimiumCHandler;
      window.addEventListener("vimiumMark", onMark, true)
    }
    return !!injector
  };
  document.head.appendChild(script);
})()
