"use strict"

const sMajorVer = /Chrome\/([0-9]+)/.exec(navigator.userAgent)[1];
const sMinorVer  = /Chrome\/[0-9]+\.[0-9]+\.([0-9]+)/.exec(navigator.userAgent)[1];
const allColors = ["purple", "blue", "green", "black"];

var myColor = allColors[sMajorVer % allColors.length];
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
ctx.font = "14px Verdana";
ctx.strokeStyle = myColor;
ctx.strokeText(sMajorVer, 1, 11);

/* On OS X maybe we need to draw our own minor version
   text because the badge truncates...
ctx.font = "8px Verdana";
ctx.strokeStyle = "black";
ctx.strokeText(sMinorVer, 1, 19);
*/

var imageData = ctx.getImageData(0, 0, 19, 19);
chrome.browserAction.setIcon({
  imageData: imageData
});
try {
    chrome.browserAction.setBadgeText( {text: sMinorVer} );     // BUG: Truncates on OS X
    chrome.browserAction.setTitle( { title: navigator.userAgent.replace("Mozilla/5.0", "") });
    chrome.browserAction.setBadgeBackgroundColor({color: myColor});
} catch (e) { alert("Error: " + e); }