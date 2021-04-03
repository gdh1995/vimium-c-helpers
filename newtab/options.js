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

var targetExtensionId = localStorage.targetExtensionId || VimiumCId;
var hasExtensionInjected = false;
var $ = document.querySelector.bind(document);

window.onload = function () {
  window.onload = null;
  var newTabUrlInput = $("#newTabUrlInput");
  var focusNewTabContentInput = $("#focusNewTabContentInput");
  var setOpenerInput = $("#setOpenerInput");
  var interactWithExtensionInput = $("#interactWithExtensionInput");
  var targetExtensionIDInput = $("#targetExtensionIDInput");
  var saveBtn = $("#saveOptions");
  var str, curInteract;

  var trans = chrome.i18n.getMessage;
  var lang = navigator.language;
  if (lang.lastIndexOf("en", 0) < 0) {
    var nodes = document.querySelectorAll("[data-i]");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].innerText = trans(nodes[i].dataset.i)
    }
    newTabUrlInput.placeholder = newTabUrlInput.placeholder.replace("like ", trans("likeUrl"));
  }
  document.documentElement.lang = trans("lang1");
  targetExtensionIDInput.placeholder = trans(OnOther === 2 ? "extId_ff" : "extId");
  if (OnOther === 2) {
    var el1 = $("#urlExample");
    el1.textContent = "https://www.bing.com/";
    el1.style.textDecoration = "";
  } else {
    setOpenerInput.disabled = true;
    setOpenerInput.checked = false;
    setOpenerInput.parentElement.style.display = "none";
  }
  str = localStorage.interactWithExtension || DefaultInteractWithExtension;
  newTabUrlInput.value = localStorage.newTabUrl || DefaultNewTab;
  curInteract = interactWithExtensionInput.checked = str !== "0" && str !== "false";
  str = localStorage.focusNewTabContent || DefaultFocusNewTabContent;
  focusNewTabContentInput.checked = str !== "0" && str !== "false";
  targetExtensionIDInput.value = targetExtensionId;
  $("#selfIDInput").onclick = function () {
    if (this.selectionStart === this.selectionEnd) {
      this.select();
    }
  };
  saveBtn.onclick = function () {
    var rawNewUrl = newTabUrlInput.value, newUrl = rawNewUrl;
    var hasError = false;
    if (!newUrl || /^(?!http|ftp)[a-z\-]+:\/?\/?(?:newtab|home)\b(?!\.html)\/?/i.test(newUrl)
        || OnOther === 2 && /^file:/i.test(newUrl)) {
      if (newUrl) {
        hasError = true;
        showError(trans("avoidStd"));
      }
      newUrl = DefaultNewTab;
    } else if (!/^[a-z\-]+:(?!\d{1,5}$)/.test(newUrl)) {
      if (/^\/?\w+\.html\b/.test(newUrl)) {
        newUrl = newUrl.slice(newUrl[0] === "/" ? 1 : 0);
      } else if ((newUrl.indexOf("/") < 0 || newUrl.indexOf("/") === newUrl.length - 1)
          && newUrl.indexOf(".") > 0) {
        newUrl = "https://" + newUrl;
      }
    }
    var newSetOpener = setOpenerInput.checked;
    var newFocusContent = focusNewTabContentInput.checked;
    var newInteract = interactWithExtensionInput.checked;
    var newID = targetExtensionIDInput.value;
    if (!newID) {
      targetExtensionIDInput.value = newID = VimiumCId;
    }
    if (newSetOpener && !newFocusContent) {
      focusNewTabContentInput.checked = newFocusContent = true;
    }
    localStorage.newTabUrl = newUrl;
    localStorage.focusNewTabContent = newFocusContent ? "1" : "0";
    localStorage.setOpener = newSetOpener ? "1" : "0";
    localStorage.interactWithExtension = newInteract ? "1" : "0";
    localStorage.targetExtensionId = newID;
    targetExtensionId = newID;
    if (newUrl !== rawNewUrl) {
      newTabUrlInput.value = newUrl;
    }
    saveBtn.textContent = trans("saved");
    saveBtn.disabled = true;
    setTimeout(function () {
      saveBtn.disabled = false;
      if (saveBtn.textContent === trans("saved")) {
        saveBtn.textContent = trans("saveOpt");
      }
    }, 1000);
    var BG = chrome.extension.getBackgroundPage();
    if (BG) {
      BG.setInteractWithExtension(newInteract);
      BG.setTargetExtensionId(newID);
    }
    if (!hasError) {
      testExtensionInjection(newInteract);
    }
  };
  testExtensionInjection(curInteract);
  window.onkeydown = function (e) {
    if (e.ctrlKey && (e.key ? e.key === "Enter" : e.keyCode === 13)
        && !(e.shiftKey || e.altKey || e.metaKey)) {
      saveBtn.click();
    }
  };
}

function testExtensionInjection(doInject) {
  if (hasExtensionInjected || !doInject) {
    hasExtensionInjected && setTimeout(recheckNewTabUrl, 0, localStorage.targetExtensionInjector || "");
    return;
  }
  var callback = function (response) {
    var error = response && response.error || chrome.runtime.lastError;
    var trans = chrome.i18n.getMessage;
    if (error) {
      var msg = error.message || error;
      msg = typeof msg === "object" ? JSON.stringify(msg) : msg + "";
      if (msg.toLowerCase().indexOf("invalid extension id") >= 0) {
        msg = trans("invalidId", [targetExtensionId]);
      } else if (msg.indexOf("extension is undefined") >= 0 || msg.indexOf("An unexpected error occurred") >= 0) {
        msg = trans("noExtension", [targetExtensionId]);
      } else if (msg.indexOf("establish connection") >= 0) {
        var str1 = targetExtensionId !== VimiumCId ? targetExtensionId : "Vimium C";
        msg = trans("connectionFail", [str1]);
      }
      showError(msg);
      return error;
    }
    var name = response && response.name ? response.name + "" : "";
    if (response === false) {
      var str2 = targetExtensionId !== VimiumCId ? trans("targetExt") : "Vimium C";
      showError(trans("addID", [str2]), "", chrome.runtime.id);
    } else if (typeof response === "object" && name
        && (response.injector != null ? response.injector : targetExtensionId === VimiumCId)) {
      hasExtensionInjected = true;
      var script = document.createElement("script");
      script.src = response.injector
          || chrome.runtime.getURL("/lib/injector.js").replace(location.host, response.host);
      script.dataset.extensionId = targetExtensionId;
      script.addEventListener("load", function () {
        showInfo(trans("injectionReady", [name]));
        localStorage.targetExtensionInjector = this.src;
        recheckNewTabUrl(this.src);
      });
      script.addEventListener("error", function (event) {
        showInfo(trans("injectionFail", [name]));
        event.preventDefault();
      });
      showError("");
      document.head.appendChild(script);
    } else {
      showError(trans("notSupported", [name || targetExtensionId]));
    }
    if (name) {
      setText($("#targetExtensionName"), name);
    }
  };
  try {
    chrome.runtime.sendMessage(targetExtensionId, { handler: "id" }, callback);
  } catch (e) {
    callback({ error: e.message });
  }
}

function recheckNewTabUrl(srcUrl) {
  var curNewTabUrl = localStorage.newTabUrl || "";
  if (/^vimium:\/\//i.test(curNewTabUrl)) {
    var match = /^[^\/]+\/\/[^\/]+\//.exec(srcUrl);
    var convertedUrl = match[0] + "pages/" + curNewTabUrl.slice(9);
    if (convertedUrl.indexOf(".html") < 0) {
      convertedUrl += ".html";
    }
    setTimeout(function() {
      $("#newTabUrlInput").value = convertedUrl;
      $("#saveOptions").onclick();
    }, 0);
  }
}

function showError(text, infoText, tailText) {
  var el = $("#errorMessage")
    , msgEditBox = el.nextElementSibling, msgEdit = msgEditBox.firstElementChild;
  setText(el, text);
  showInfo(infoText || "");
  tailText = tailText || "";
  if (msgEdit.value !== tailText) {
    msgEdit.value = tailText;
  }
  msgEditBox.style.display = tailText ? "flex" : "none";
}

function showInfo(text) {
  setText($("#infoMessage"), text);
}

function setText(element, text) {
  if (element.textContent !== text) {
    element.textContent = text;
  }
}
