"use strict";

if (typeof chrome.runtime === "undefined") chrome = browser;

document.addEventListener('DOMContentLoaded', function() {
        chrome.runtime.getPlatformInfo(function (o) {
            const arrVer = / Edg\/([0-9.]+)/.exec(navigator.userAgent);
            let sEdge = (arrVer && arrVer.length > 0) ? arrVer[1] : "";
            if (sEdge) (sEdge = "Edge v" + sEdge + "; Chromium v");
            document.getElementById("txtStatus").textContent = sEdge +
            /Chrome\/([0-9.]+)/.exec(navigator.userAgent)[1] + "\n" +
            JSON.stringify(o);
        });

        const lnkMoreInfo = document.getElementById("lnkMoreInfo");
        lnkMoreInfo.addEventListener("click", function() { chrome.tabs.create({url: "chrome://version/"}); }, false);

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

