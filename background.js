"use strict"

const sMajorVer = /Chrome\/([0-9]+)/.exec(navigator.userAgent)[1];
const sMinorVer  = /Chrome\/[0-9]+\.[0-9]+\.([0-9]+)/.exec(navigator.userAgent)[1];
const allColors = ["purple", "blue", "green", "black"];
const bIsMac = navigator.userAgent.includes("Mac OS X");

var myColor = allColors[sMajorVer % allColors.length];
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
ctx.font = "14px Verdana";
ctx.strokeStyle = myColor;
ctx.strokeText(sMajorVer, 1, 11);

if (bIsMac)
{
/* On OS X we need to draw our own minor version
   text because the badge truncates. It's unappealing to
   do this in general because on Windows at least, using
   the badge gives us a bit more vertical space. */
    // ctx.fillStyle = "white";
    // ctx.fillRect(0,12,19,19);
    ctx.font = "9px Helvetica Neue";
    ctx.fillStyle = myColor;
    ctx.fillText(sMinorVer, 0, 19);
}

var imageData = ctx.getImageData(0, 0, 19, 19);
chrome.browserAction.setIcon({
  imageData: imageData
});
try {
    chrome.browserAction.setTitle( { title: navigator.userAgent.replace("Mozilla/5.0", "") });
    if (!bIsMac)
    {
        chrome.browserAction.setBadgeText( {text: sMinorVer} );     // BUG: Truncates on OS X
        chrome.browserAction.setBadgeBackgroundColor({color: myColor});
    }
} catch (e) { alert("Error: " + e); }