"use strict";

var OnOther = "undefined" === typeof browser || null == (browser && browser.runtime)
    || location.protocol.lastIndexOf("chrome", 0) >= 0 ? 1 /* Chrome */ : 2 /* Firefox */;
var VimiumCId = OnOther === 1 ? "hfjbmagddngcpeloejdejnfgbamkjaeg" : "vimium-c@gdh1995.cn";
if (OnOther !== 1) {
  window.chrome = browser;
}
var DefaultKeepAliveTime = 120;

var hasVimiumCInjected = false;

window.onload = function () {
  window.onload = null;
  var BG = chrome.extension.getBackgroundPage();
  if (BG) {
    VimiumCId = BG.VimiumCId;
    DefaultKeepAliveTime = BG.DefaultKeepAliveTime;
  }
  var targetExtensionIDInput = document.querySelector("#targetExtensionIDInput");
  var keepAliveTimeInput = document.querySelector("#keepAliveTimeInput");
  var saveBtn = document.querySelector("#saveOptions");
  var curId = targetExtensionIDInput.value = BG && BG.targetExtensionId || localStorage.targetExtensionId || VimiumCId;
  var curKeepAliveTime = BG && BG.keepAliveTime ||
        (localStorage.keepAliveTime ? +localStorage.keepAliveTime : DefaultKeepAliveTime);
  if (isNaN(curKeepAliveTime) || !isFinite(curKeepAliveTime) || curKeepAliveTime < 0) {
    curKeepAliveTime = curKeepAliveTime === -1 ? 0 : DefaultKeepAliveTime;
  }
  keepAliveTimeInput.value  = curKeepAliveTime;
  saveBtn.onclick = function () {
    var newID = targetExtensionIDInput.value;
    if (!newID) {
      targetExtensionIDInput.value = newID = VimiumCId;
    }
    var newTimeStr = +keepAliveTimeInput.value, newTime = newTimeStr ? +newTimeStr : DefaultKeepAliveTime;
    if (isNaN(newTime) || !isFinite(newTime) || newTime < 0) {
      newTime = newTime === -1 ? 0 : DefaultKeepAliveTime;
    }
    if (newTimeStr !== "" + newTime) {
      newTimeStr = "" + newTime;
      keepAliveTimeInput.value = newTimeStr;
    }
    localStorage.targetExtensionId = newID;
    localStorage.keepAliveTime = newTimeStr;
    saveBtn.textContent = "Saved";
    saveBtn.disabled = true;
    setTimeout(function () {
      saveBtn.disabled = false;
      if (saveBtn.textContent === "Saved") {
        saveBtn.textContent = "Save Options";
      }
    }, 1000);
    var BG1 = chrome.extension.getBackgroundPage();
    if (BG1) {
      BG1.setTargetExtensionId(newID);
      BG1.setKeepAliveTime(newTime);
    }
    testTargetExtension(newID);
  };
  testTargetExtension(curId);
  window.onkeydown = function (e) {
    if (e.ctrlKey && (e.key ? e.key === "Enter" : e.keyCode === 13)
        && !(e.shiftKey || e.altKey || e.metaKey)) {
      saveBtn.click();
    }
  };
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
      } else if (hasVimiumCInjected || targetId !== VimiumCId) {
        showError("", 'The target "' + response.name + '" accepted.');
      } else {
        hasVimiumCInjected = true;
        var script = document.createElement("script");
        script.src = chrome.runtime.getURL("/lib/injector.js").replace(location.host, response.host);
        script.addEventListener("load", function () {
          showInfo("Congratulations! " + response.name + " connected.");
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
  });
}

function showError(text, infoText) {
  document.querySelector("#errorMessage").textContent = text;
  showInfo(infoText || "");
}

function showInfo(text) {
  document.querySelector("#infoMessage").textContent = text;
}
