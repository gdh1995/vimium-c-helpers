"use strict";

var OnOther = "undefined" === typeof browser || null == (browser && browser.runtime)
    || location.protocol.lastIndexOf("chrome", 0) >= 0 ? 1 /* Chrome */ : 2 /* Firefox */;
var hasVimiumCInjected = false;
var BG = null;
if (OnOther !== 1) {
  window.chrome = browser;
}

window.onload = function () {
  window.onload = null;
  BG = chrome.extension.getBackgroundPage();
  var targetExtensionIDInput = document.querySelector("#targetExtensionIDInput");
  var curId = targetExtensionIDInput.value = BG.targetExtensionId || BG.VimiumCId;
  var saveBtn = document.querySelector("#saveOptions");
  saveBtn.onclick = function () {
    var newValue = targetExtensionIDInput.value;
    if (!newValue) {
      targetExtensionIDInput.value = newValue = BG.VimiumCId;
    }
    localStorage.targetExtensionId = BG.targetExtensionId = newValue;
    saveBtn.textContent = "Saved";
    saveBtn.disabled = true;
    setTimeout(function () {
      saveBtn.disabled = false;
      if (saveBtn.textContent === "Saved") {
        saveBtn.textContent = "Save Options";
      }
    }, 1000);
    testTargetExtension(newValue);
  }
  testTargetExtension(curId);
}

function testTargetExtension(targetId) {
  chrome.runtime.sendMessage(targetId, {
    handler: "id"
  }, function (response) {
    var error = chrome.runtime.lastError;
    if (error) {
      var msg = error.message || error;
      msg = typeof msg === "object" ? JSON.stringify(msg) : msg + "";
      if (msg.indexOf("establish connection")) {
        msg = "Can not connect to the target extension.";
      }
      showError(msg);
      return error;
    }
    if (response === false) {
      showError('Please add "' + chrome.runtime.id + '" to target extension\'s whitelist');
    } else if (typeof response === "object" && /\bVimium C\b/.test(response.name + "")) {
      if (response.shortcuts === false) {
        showError('The target "' + response.name + '" doesn\'t support shortcuts.');
      } else if (hasVimiumCInjected || targetId !== BG.VimiumCId) {
        showError("", 'The target "' + response.name + '" accepted.');
      } else {
        hasVimiumCInjected = true;
        var script = document.createElement("script");
        script.src = chrome.runtime.getURL("/lib/injector.js").replace(location.host, response.host);
        script.addEventListener("load", function () {
          showInfo(response.name + " connected.");
          this.remove();
        });
        script.addEventListener("error", function (event) {
          showInfo('The target "' + response.name + '" accepted.');
          event.preventDefault();
        });
        showError("");
        document.head.appendChild(script);
      }
    } else {
      showError('The target extension is not supported.');
    }
  })
}

function showError(text, infoText) {
  document.querySelector("#errorMessage").textContent = text;
  showInfo(infoText || "");
}

function showInfo(text) {
  document.querySelector("#infoMessage").textContent = text;
}
