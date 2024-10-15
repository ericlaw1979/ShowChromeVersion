"use strict";

if (typeof chrome.runtime === "undefined") chrome = browser;

// Get the version info and call the callback when it's ready.
function getVersionInfo(cb) {
  let verPlatform = '0.0.0.0';
  let verBrowser = '0.0.0.0';
  let bEdge = false;
  navigator.userAgentData.getHighEntropyValues(['fullVersionList'])
        .then(ua => { 
          ua.fullVersionList.forEach(item=>{
            if (item.brand==='Chromium') verPlatform = item.version;
            if (item.brand==='Google Chrome') verBrowser = item.version;
            if (item.brand==='Microsoft Edge') { verBrowser = item.version; bEdge=true; }
          });
          cb({"platform":verPlatform, "browser":verBrowser, "isEdge":bEdge });
        });
}

function updateUI(verInfo) {
    chrome.runtime.getPlatformInfo(function (o) {

      const bIsEdge = verInfo.isEdge;
      let sVersion = verInfo.browser;
      if (bIsEdge) {
        sVersion = `Edge v${sVersion}\nChromium v${verInfo.platform}`;
        document.getElementById("txtTitle").textContent = "Edge Version";
        document.getElementById("lnkMoreInfo").textContent = "Full Edge Info";
      }

      document.getElementById("txtStatus").textContent = 
        (sVersion + "\n" + JSON.stringify(o, (k,v) => {if (k==="nacl_arch") return undefined; return v; } ));

      const majorVersion = verInfo.platform.match(/(\d{1,3})/g)[0];
      const lnlnkRegressionsForThisVersion = document.getElementById("lnkRegressionsForThisVersion");
      let href = `https://bugs.chromium.org/p/chromium/issues/list?can=2&q=FoundIn%3D${majorVersion}+Type%3DBug-Regression&sort=-stars`;
      lnlnkRegressionsForThisVersion.addEventListener("click", function() { chrome.tabs.create({url: href });}, false);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const lnkMoreInfo = document.getElementById("lnkMoreInfo");
    lnkMoreInfo.addEventListener("click", function() { chrome.tabs.create({url: "chrome://version/?show-variations-cmd"}); }, false);

    const lnkAllVersions = document.getElementById("lnkAllVersions");
    lnkAllVersions.addEventListener("click", function() { chrome.tabs.create({url: "https://chromiumdash.appspot.com/"}); }, false);

    const lnkSysInfo = document.getElementById("lnkSysInfo");
    lnkSysInfo.addEventListener("click", function() { chrome.tabs.create({url: "chrome://system/"}); }, false);

    const lnkCopyForBug = document.getElementById("lnkCopyForBug");
    lnkCopyForBug.addEventListener("click", function() { copyForBug(); }, false);

    getVersionInfo(info => { updateUI(info); });
}, false);

function copyForBug()
{
    const copyFrom = document.createElement("textarea");

    // TODO: Generate a proper report
    copyFrom.textContent = document.getElementById("txtStatus").textContent;
    document.body.appendChild(copyFrom);
    copyFrom.focus();
    copyFrom.select();
    document.execCommand('Copy', false, null);
    copyFrom.remove();
    const lnkCopyForBug = document.getElementById("lnkCopyForBug");
    lnkCopyForBug.textContent = "copied!";
    setTimeout(function() { lnkCopyForBug.innerHTML = "Copy"; }, 450);
}
