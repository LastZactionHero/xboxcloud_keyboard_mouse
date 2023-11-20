document.getElementById("version").innerText = chrome.runtime.getManifest().version;

chrome.storage.sync.get([], function(settings) {});