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

        // Draw rect to support dark theme
        ctx.fillStyle = "#eee";
        ctx.fillRect(0, 0, 38, 38);
        ctx.strokeStyle = "#333";
        ctx.strokeRect(0, 0, 38, 38);

        ctx.font = "bold 28px Verdana";
        ctx.fillStyle = myColor;
        ctx.fillText(sMajorVer, 2, 22);
        ctx.font = "18px Arial Narrow";
        ctx.fillText(sMinorVer, 2, 38);
        imageData = ctx.getImageData(0, 0, 38, 38);
    }
    else {
        // Draw rect to support dark theme
        ctx.fillStyle = "#eee";    
        ctx.fillRect(0, 0, 16, 16);
        ctx.strokeStyle = "#333";
        ctx.strokeRect(0, 0, 16, 16);

        ctx.font = "10px Segoe UI Light";
        ctx.strokeStyle = myColor;
        //ctx.fillText(sMajorVer, 3, 9);
        ctx.strokeText(sMajorVer.split("").join(String.fromCharCode(8202)), 2, 9);
        imageData = ctx.getImageData(0, 0, 16, 16);
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

chrome.runtime.onInstalled.addListener(updateUI);
chrome.runtime.onStartup.addListener(updateUI);