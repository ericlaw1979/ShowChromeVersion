"use strict";

if (typeof chrome.runtime === "undefined") chrome = browser;

document.addEventListener('DOMContentLoaded', function() {        
        const lnkMoreInfo = document.getElementById("lnkMoreInfo");
        lnkMoreInfo.addEventListener("click", function() { chrome.tabs.create({url: "chrome://version/?show-variations-cmd"}); }, false);

        const lnkAllVersions = document.getElementById("lnkAllVersions");
        lnkAllVersions.addEventListener("click", function() { chrome.tabs.create({url: "https://omahaproxy.appspot.com/"}); }, false);

        const lnkSysInfo = document.getElementById("lnkSysInfo");
        lnkSysInfo.addEventListener("click", function() { chrome.tabs.create({url: "chrome://system/"}); }, false);

        const lnkCopyForBug = document.getElementById("lnkCopyForBug");
        lnkCopyForBug.addEventListener("click", function() { copyForBug(); }, false);        

        if (navigator.userAgent.indexOf(" Edg/") > -1) {
          document.getElementById("txtTitle").textContent = "Edge Version";
          document.getElementById("lnkMoreInfo").textContent = "Full Edge Info";
        }

        chrome.runtime.getPlatformInfo(function (o) {
            const arrVer = / Edg\/([0-9.]+)/.exec(navigator.userAgent);
            let sEdge = (arrVer && arrVer.length > 0) ? arrVer[1] : "";
            if (sEdge) (sEdge = "Edge v" + sEdge + "; Chromium v");
            let data = sEdge + /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1] + "\n" + JSON.stringify(o);
            document.getElementById("txtStatus").textContent = data;

            const majorVersion = arrVer[1].match(/(\d{1,3})/g)[0];
            const lnlnkRegressionsForThisVersion = document.getElementById("lnkRegressionsForThisVersion");
            let href = `https://bugs.chromium.org/p/chromium/issues/list?can=2&q=FoundIn%3D${majorVersion}+`;     
            lnlnkRegressionsForThisVersion.addEventListener("click", function() { chrome.tabs.create({url: href });}, false);
        });
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
