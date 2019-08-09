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

var hasVimiumCInjected = false;

window.onload = function () {
  window.onload = null;
  var newTabUrlInput = document.querySelector("#newTabUrlInput");
  var focusNewTabContentInput = document.querySelector("#focusNewTabContentInput");
  var interactWithVimiumCInput = document.querySelector("#interactWithVimiumCInput");
  var saveBtn = document.querySelector("#saveOptions");
  var str = localStorage.interactWithVimiumC || DefaultInteractWithVimiumC;
  newTabUrlInput.value = localStorage.newTabUrl || DefaultNewTab;
  focusNewTabContentInput.checked = str !== "0" && str !== "false";
  str = localStorage.focusNewTabContent || DefaultFocusNewTabContent;
  var curInteract = interactWithVimiumCInput.checked = str !== "0" && str !== "false";
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
    var newInteract = interactWithVimiumCInput.checked;
    localStorage.newTabUrl = newUrl;
    localStorage.focusNewTabContent = newFocusContent ? "1" : "0";
    localStorage.interactWithVimiumC = newInteract ? "1" : "0";
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
      BG.setInteractWithVimiumC(newInteract);
    }
    testVimiumCInjection(newInteract);
  };
  testVimiumCInjection(curInteract);
  window.onkeydown = function (e) {
    if (e.ctrlKey && (e.key ? e.key === "Enter" : e.keyCode === 13)
        && !(e.shiftKey || e.altKey || e.metaKey)) {
      saveBtn.click();
    }
  };
}

function testVimiumCInjection(doInject) {
  if (hasVimiumCInjected || !doInject) { return; }
  chrome.runtime.sendMessage(VimiumCId, {
    handler: "id"
  }, function (response) {
    var error = chrome.runtime.lastError;
    if (error) {
      var msg = error.message || error;
      msg = typeof msg === "object" ? JSON.stringify(msg) : msg + "";
      if (msg.indexOf("establish connection")) {
        msg = 'Can not connect to the extension "Vimium C".';
      }
      showError(msg);
      return error;
    }
    if (response === false) {
      showError('Please add "' + chrome.runtime.id + '" to Vimium C\'s "Whitelist of otherextension IDs"');
    } else if (typeof response === "object" && /\bVimium C\b/.test(response.name + "")) {
      hasVimiumCInjected = true;
      var script = document.createElement("script");
      script.src = chrome.runtime.getURL("/lib/injector.js").replace(location.host, response.host);
      script.addEventListener("load", function () {
        showInfo("Congratulations! " + response.name + " is ready.");
        localStorage.vimiumCInjector = this.src;
        this.remove();
      });
      script.addEventListener("error", function (event) {
        showInfo('The extension "' + response.name + '" accepted but injection failed.');
        event.preventDefault();
      });
      showError("");
      document.head.appendChild(script);
    } else {
      showError("The target extension " + (response.name || "(unknown name)") + " is not supported.");
    }
  });
}

function showError(text, infoText) {
  document.querySelector("#errorMessage").textContent = text;
  showInfo(infoText || "");
}

function showInfo(text) {
  document.querySelector("#infoMessage").textContent = text;
}
