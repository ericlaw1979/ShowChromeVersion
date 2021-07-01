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

    // Select color palette based on dark/light theme. Use light colors on
    // Dark Mode and vice-versa.
    const bDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const arrDarkColors = ["purple", "blue", "green", "black"];
    const arrColors = bDarkMode ? ["fuchsia", "aqua", "lime", "white"] 
                    : arrDarkColors;

    const myColor = arrColors[sMajorVer % arrColors.length];
    const myBadgeColor = arrDarkColors[sMajorVer % arrDarkColors.length];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    var imageData;
    ctx.font = "14px Verdana";
    ctx.strokeStyle = myColor;
    ctx.strokeText(sMajorVer, 1, 11);
    imageData = ctx.getImageData(0, 0, 19, 19);

    try {
        chrome.browserAction.setIcon({ imageData: imageData });
        chrome.browserAction.setTitle({ title: navigator.userAgent.replace("Mozilla/5.0", "") });
        chrome.browserAction.setBadgeText( {text: sMinorVer} );
        chrome.browserAction.setBadgeBackgroundColor({color: myBadgeColor});
    }
    catch (e) { console.error(e); }
}

// There's a pending update available; user must restart the browser.
function showUpdateAvailable() {
  chrome.browserAction.setBadgeBackgroundColor({color: "red"});
  chrome.browserAction.setBadgeText( {text: "Stale"} );
}

chrome.runtime.onInstalled.addListener(updateUI);
chrome.runtime.onStartup.addListener(updateUI);
chrome.runtime.onBrowserUpdateAvailable.addListener(showUpdateAvailable);
