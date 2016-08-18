"use strict"

const sMajorVer = /Chrome\/([0-9]+)/.exec(navigator.userAgent)[1];
const allColors = ["red", "blue", "green", "black"];

var myColor = allColors[sMajorVer % allColors.length];
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
ctx.font = "14px Verdana";
ctx.strokeStyle = myColor;
ctx.strokeText(sMajorVer, 1, 11);
var imageData = ctx.getImageData(0, 0, 19, 19);
chrome.browserAction.setIcon({
  imageData: imageData
}); 
const sVer = /Chrome\/[0-9]+\.[0-9]+\.([0-9]+)/.exec(navigator.userAgent)[1];
try {
    chrome.browserAction.setBadgeText( {text: sVer} );
    chrome.browserAction.setTitle( { title: navigator.userAgent });
    chrome.browserAction.setBadgeBackgroundColor({color: myColor});
} catch (e) { alert("Error: " + e); }