chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostEquals: "html5gamepad.com"},
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostEquals: "hardwaretester.com"},
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostEquals: "xbox.com"},
                }),
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
    const startParams = {
        "stickRadius": 50,
        "buttonDiameter": 70,
        "buttonBorderLeftOffset": 30,
        "buttonBorderRightOffset": 30,
        "buttonBorderTopOffset": 80,
        "buttonBorderBottomOffset": 30,
        "opacity": 255,
        "enableColors": false,
        "enableDrawSticks" : false,
        "buttonConfig": null,
        "firstRun": true
    };
    chrome.storage.sync.get([
        "stickRadius",
        "buttonDiameter",
        "buttonBorderLeftOffset",
        "buttonBorderRightOffset",
        "buttonBorderTopOffset",
        "buttonBorderBottomOffset",
        "opacity",
        "enableColors",
        "enableDrawSticks",
        "buttonConfig",
        "firstRun"
    ], function(settings) {
        for(const key of Object.keys(settings)){
            startParams[key] = settings[key];
        }
        chrome.storage.sync.set(startParams, function() {
        });
    });
});