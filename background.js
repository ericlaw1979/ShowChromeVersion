"use strict"

/*
* We rely upon the getHighEntropyValues() API[1] to get the full version information
* which is not otherwise revealed to websites for privacy reasons.
*
* [1] https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/getHighEntropyValues#:~:text=Accept%2DCH%20header.-,fullVersionList,-An%20array%20of
*/

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

function updateUI(sUA) {
    console.log('updateUI() was called at ' + new Date());

    // If we didn't get passed a UA, generate a fake one.
    if (!sUA && navigator.userAgentData) {
      getVersionInfo(verInfo => { updateUI((verInfo.isEdge ? 'Edg/' : 'Chrome/') + verInfo.browser); });
      return;
    }

    // If we don't have a UA by now, use the UA String (which may be inaccurate).
    if (!sUA) sUA = navigator.userAgent || 'Chrome/99.99.99.99';
    console.log(sUA);

    let sMajorVer = "99";
    let sMinorVer = "99";
    if (sUA.includes("Edg/")) {
      sMajorVer = /Edg\/([0-9]+)/.exec(sUA)[1];
      sMinorVer  = /Edg\/[0-9]+\.[0-9]+\.([0-9]+)/.exec(sUA)[1];
    } else {
      sMajorVer = /Chrome\/([0-9]+)/.exec(sUA)[1];
      sMinorVer = /Chrome\/[0-9]+\.[0-9]+\.([0-9]+)/.exec(sUA)[1];
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
    ctx.font = '14px Verdana';
    ctx.strokeStyle = myColor;
    ctx.strokeText(sMajorVer, 1, 11);
    imageData = ctx.getImageData(0, 0, ctx.measureText(sMajorVer).width+2, 19);

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
  console.log("showUpdateAvailable was called at " + new Date());
  chrome.browserAction.setBadgeBackgroundColor({color: "red"});
  chrome.browserAction.setBadgeText( {text: "Stale"} );
}

chrome.runtime.onInstalled.addListener(() => updateUI());
chrome.runtime.onStartup.addListener(() => updateUI());
chrome.runtime.onBrowserUpdateAvailable.addListener(showUpdateAvailable);
