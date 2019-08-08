"use strict"

function updateUI() {
    let sMajorVer = /Chrome\/([0-9]+)/.exec(navigator.userAgent)[1];
    let sMinorVer  = /Chrome\/[0-9]+\.[0-9]+\.([0-9]+)/.exec(navigator.userAgent)[1];
    let bIsEdge = false;

    if (navigator.userAgent.indexOf(" Edg/") > -1) {
      bIsEdge = true;
      sMajorVer = /Edg\/([0-9]+)/.exec(navigator.userAgent)[1];
      sMinorVer  = /Edg\/[0-9]+\.[0-9]+\.([0-9]+)/.exec(navigator.userAgent)[1];
    }
    const allColors = ["purple", "blue", "green", "black"];
    const bIsMac = navigator.userAgent.includes("Mac OS X");

    const myColor = allColors[sMajorVer % allColors.length];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    var imageData;
    if (bIsMac) {
    /* On OS X we need to draw our own minor version
       text because the badge truncates. It's unappealing to
       do this in general because on Windows at least, using
       the badge gives us a bit more vertical space. */

        ctx.font = "bold 28px Verdana";
        ctx.fillStyle = myColor;
        ctx.fillText(sMajorVer, 0, 22);
        ctx.font = "18px Arial Narrow";
        ctx.fillText(sMinorVer, 3, 38);
        imageData = ctx.getImageData(0, 0, 38, 38);
    }
    else {
        ctx.font = "14px Verdana";
        ctx.strokeStyle = myColor;
        ctx.strokeText(sMajorVer, 1, 11);
        imageData = ctx.getImageData(0, 0, 19, 19);
    }

    try {
        chrome.browserAction.setIcon({ imageData: imageData });
        chrome.browserAction.setTitle({ title: navigator.userAgent.replace("Mozilla/5.0", "") });
        if (!bIsMac) {
            chrome.browserAction.setBadgeText( {text: sMinorVer} );
            chrome.browserAction.setBadgeBackgroundColor({color: myColor});
        }
    } catch (e) { console.error(e); }
}

// There's a pending update available; user must restart the browser.
function showUpdateAvailable() {
  chrome.browserAction.setBadgeBackgroundColor({color: "red"});
  chrome.browserAction.setBadgeText( {text: "Stale"} );
}

chrome.runtime.onInstalled.addListener(updateUI);
chrome.runtime.onStartup.addListener(updateUI);
chrome.runtime.onBrowserUpdateAvailable.addListener(showUpdateAvailable);