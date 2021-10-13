"use strict";

if (typeof chrome.runtime === "undefined") chrome = browser;

function updateUI(bIsEdge, sFullVersion, verChrome) {
    chrome.runtime.getPlatformInfo(function (o) {
      let sVersion = sFullVersion;
      if (bIsEdge) (sVersion = "Edge v" + sVersion + "; Chromium v" + verChrome);

       let data = sVersion + "\n" + JSON.stringify(o, (k,v) => {if (k==="nacl_arch") return undefined; return v; } );
       document.getElementById("txtStatus").textContent = data;

       const majorVersion = verChrome.match(/(\d{1,3})/g)[0];
       const lnlnkRegressionsForThisVersion = document.getElementById("lnkRegressionsForThisVersion");
       let href = `https://bugs.chromium.org/p/chromium/issues/list?can=2&q=FoundIn%3D${majorVersion}+Type%3DBug-Regression&sort=-stars`;
       lnlnkRegressionsForThisVersion.addEventListener("click", function() { chrome.tabs.create({url: href });}, false);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const lnkMoreInfo = document.getElementById("lnkMoreInfo");
    lnkMoreInfo.addEventListener("click", function() { chrome.tabs.create({url: "chrome://version/?show-variations-cmd"}); }, false);

    const lnkAllVersions = document.getElementById("lnkAllVersions");
    lnkAllVersions.addEventListener("click", function() { chrome.tabs.create({url: "https://omahaproxy.appspot.com/"}); }, false);

    const lnkSysInfo = document.getElementById("lnkSysInfo");
    lnkSysInfo.addEventListener("click", function() { chrome.tabs.create({url: "chrome://system/"}); }, false);

    const lnkCopyForBug = document.getElementById("lnkCopyForBug");
    lnkCopyForBug.addEventListener("click", function() { copyForBug(); }, false);

    let bIsEdge = navigator.userAgent.includes(' Edg/');
    if (navigator.userAgentData) {
      for (let brand_version_pair of navigator.userAgentData.brands) {
        if (brand_version_pair.brand == "Microsoft Edge") bIsEdge = true;
      }
    }

    if (bIsEdge) {
      document.getElementById("txtTitle").textContent = "Edge Version";
      document.getElementById("lnkMoreInfo").textContent = "Full Edge Info";
    }

    const verChrome = /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1];
    navigator.userAgentData.getHighEntropyValues(['uaFullVersion'])
      .then(ua => { updateUI(bIsEdge, ua.uaFullVersion, verChrome); });
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
