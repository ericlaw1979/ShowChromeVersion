// https://developer.chrome.com/blog/Offscreen-Documents-in-Manifest-v3

// Registering this listener when the script is first executed ensures that the
// offscreen document will be able to receive messages when the promise returned
// by `offscreen.createDocument()` resolves.
chrome.runtime.onMessage.addListener(handleMessages);

// This function performs basic filtering and error checking on messages before
// dispatching the message to a more specific message handler.
async function handleMessages(message) {
  // Return early if this message isn't meant for the offscreen document.
  if (message.target !== 'offscreen') return false;

  // Dispatch the message to an appropriate handler.
  switch (message.type) {
    case 'get-Version-Icon':
      getVersionIcon(message.data.sMajorVer);
      break;
    default:
      console.warn(`Offscreen received unexpected message: '${JSON.stringify(message.type)}'.`);
      return false;
  }
}

// The window object isn't available inside a ServiceWorker, and thus we need to use
// this offscreen document to detect it for now. See https://github.com/w3c/webextensions/issues/229.
function getVersionIcon(sMajorVer) {
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

    ctx.font = '14px Verdana';
    ctx.strokeStyle = myColor;
    ctx.strokeText(sMajorVer, 1, 11);
    const imageData = ctx.getImageData(0, 0, ctx.measureText(sMajorVer).width+2, 19);

    sendToServiceWorker('update-Icon', {'imgData': imageData, 'badgeColor': myBadgeColor});
}

function sendToServiceWorker(type, data) {
    // Note: we cannot use chrome.runtime.sendMessage to send ImageData.
    // See https://mastodon.social/@dotproto@toot.cafe/113313366050429881
    navigator.serviceWorker.controller.postMessage({type, target: 'serviceworker', data});
}