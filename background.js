"use strict"

// TODO: Flip color based on major version
const sMajorVer = /Chrome\/([0-9]+)/.exec(navigator.userAgent)[1];
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
ctx.font = "12px Sans-Serif";
ctx.fillStyle = "blue";
ctx.strokeText(sMajorVer, 2, 10);
var imageData = ctx.getImageData(0, 0, 19, 19);
chrome.browserAction.setIcon({
  imageData: imageData
}); 
const sVer = /Chrome\/[0-9]+\.[0-9]+\.([0-9]+)/.exec(navigator.userAgent)[1];
try {
    chrome.browserAction.setBadgeText( {text: sVer} );
    chrome.browserAction.setTitle( { title: navigator.userAgent });
} catch (e) { alert("Error: " + e); }