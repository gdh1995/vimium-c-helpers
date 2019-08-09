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

var targetExtensionId = localStorage.targetExtensionId || VimiumCId;
var hasExtensionInjected = false;

window.onload = function () {
  window.onload = null;
  var newTabUrlInput = document.querySelector("#newTabUrlInput");
  var focusNewTabContentInput = document.querySelector("#focusNewTabContentInput");
  var interactWithExtensionInput = document.querySelector("#interactWithExtensionInput");
  var saveBtn = document.querySelector("#saveOptions");
  var str = localStorage.interactWithExtension || DefaultInteractWithExtension;
  newTabUrlInput.value = localStorage.newTabUrl || DefaultNewTab;
  focusNewTabContentInput.checked = str !== "0" && str !== "false";
  str = localStorage.focusNewTabContent || DefaultFocusNewTabContent;
  var curInteract = interactWithExtensionInput.checked = str !== "0" && str !== "false";
  saveBtn.onclick = function () {
    var rawNewUrl = newTabUrlInput.value, newUrl = rawNewUrl;
    if (!newUrl) {
      newUrl = DefaultNewTab;
    } else if (!/^[a-z\-]+:(?!\d{1,5}$)/.test(newUrl)) {
      if (/^\/?\w+\.html\b/.test(newUrl)) {
        newUrl = newUrl.slice(newUrl[0] === "/" ? 1 : 0);
      } else if ((newUrl.indexOf("/") < 0 || newUrl.indexOf("/") === newUrl.length - 1)
          && newUrl.indexOf(".") > 0) {
        newUrl = "https://" + newUrl;
      }
    }
    var newFocusContent = focusNewTabContentInput.checked;
    var newInteract = interactWithExtensionInput.checked;
    localStorage.newTabUrl = newUrl;
    localStorage.focusNewTabContent = newFocusContent ? "1" : "0";
    localStorage.interactWithExtension = newInteract ? "1" : "0";
    if (newUrl !== rawNewUrl) {
      newTabUrlInput.value = newUrl;
    }
    saveBtn.textContent = "Saved";
    saveBtn.disabled = true;
    setTimeout(function () {
      saveBtn.disabled = false;
      if (saveBtn.textContent === "Saved") {
        saveBtn.textContent = "Save Options";
      }
    }, 1000);
    var BG = chrome.extension.getBackgroundPage();
    if (BG) {
      BG.setInteractWithExtension(newInteract);
    }
    testExtensionInjection(newInteract);
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
  if (hasExtensionInjected || !doInject) { return; }
  chrome.runtime.sendMessage(targetExtensionId, {
    handler: "id"
  }, function (response) {
    var error = chrome.runtime.lastError;
    if (error) {
      var msg = error.message || error;
      msg = typeof msg === "object" ? JSON.stringify(msg) : msg + "";
      if (msg.indexOf("establish connection")) {
        var str1 = targetExtensionId !== VimiumCId ? targetExtensionId : "Vimium C";
        msg = 'Can not connect to the extension "' + str1 + '".';
      }
      showError(msg);
      return error;
    }
    var name = response && response.name ? response.name + "" : "";
    if (response === false) {
      var str2 = targetExtensionId !== VimiumCId ? "target extension" : "Vimium C";
      showError('Please add "' + chrome.runtime.id + '" to ' + str2 + "'s whitelist");
    } else if (typeof response === "object" && name
        && (response.injector != null ? response.injector : targetExtensionId === VimiumCId)) {
      hasExtensionInjected = true;
      var script = document.createElement("script");
      script.src = response.injector
          || chrome.runtime.getURL("/lib/injector.js").replace(location.host, response.host);
      script.dataset.extensionId = targetExtensionId;
      script.addEventListener("load", function () {
        showInfo("Congratulations! " + name + " is ready.");
        localStorage.targetExtensionInjector = this.src;
        this.remove();
      });
      script.addEventListener("error", function (event) {
        showInfo('The extension "' + name + '" accepted but injection failed.');
        event.preventDefault();
      });
      showError("");
      document.head.appendChild(script);
    } else {
      showError("The target extension " + (name || targetExtensionId) + " is not supported.");
    }
    if (name) {
      setText(document.querySelector("#targetExtensionName"), name);
    }
  });
}

function showError(text, infoText) {
  setText(document.querySelector("#errorMessage"), text);
  showInfo(infoText || "");
}

function showInfo(text) {
  setText(document.querySelector("#infoMessage"), text);
}

function setText(element, text) {
  if (element.textContent !== text) {
    element.textContent = text;
  }
}
