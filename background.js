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

async function sendMessageToOffscreenDocument(type, data) {
  // Create an offscreen document if one doesn't exist yet
  if (!(await hasDocument())) {
    await chrome.offscreen.createDocument({
      url: '/offscreen.html',
      reasons: [chrome.offscreen.Reason.DOM_SCRAPING],
      justification: 'Need to use CSS media rules to detect Dark mode; also uses a Canvas'
    });
  }
  chrome.runtime.sendMessage({
    type,
    target: 'offscreen',
    data
  });
}

async function closeOffscreenDocument() {
  if (!(await hasDocument())) return;
  await chrome.offscreen.closeDocument();
}

async function hasDocument() {
  // Check all windows controlled by the service worker if one of them is the offscreen document
  const matchedClients = await clients.matchAll();
  for (const client of matchedClients) {
    if (client.url.endsWith('/offscreen.html')) return true;
  }
  return false;
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

    sendMessageToOffscreenDocument('get-Version-Icon', {'sMajorVer': sMajorVer});
    try {
        chrome.action.setTitle({ title: navigator.userAgent.replace('Mozilla/5.0', '') });
        chrome.action.setBadgeText( {text: sMinorVer} );
    }
    catch (e) { console.error(e); }
}

addEventListener("message", async (message) => {
  // Return early if this message isn't meant for the ServiceWorker. (WAT?)
  if (message.data.target !== 'serviceworker') return;

  switch (message.data.type) {
    case 'update-Icon':
      handleUpdateIcon(message.data.data);
      closeOffscreenDocument();
      break;
    default:
      console.warn(`Unexpected message type received: '${message.data.type}'.`);
  }
});

async function handleUpdateIcon(data) {
  chrome.action.setBadgeBackgroundColor({color: data.badgeColor});
  chrome.action.setIcon({imageData: data.imgData});
}

// There's a pending Browser update available; user should restart the browser.
function showUpdateAvailable() {
  console.log("showUpdateAvailable was called at " + new Date());
  chrome.browserAction.setBadgeBackgroundColor({color: "red"});
  chrome.browserAction.setBadgeText( {text: "Stale"} );
}

chrome.runtime.onInstalled.addListener(() => updateUI());
chrome.runtime.onStartup.addListener(() => updateUI());
chrome.runtime.onBrowserUpdateAvailable.addListener(showUpdateAvailable);
