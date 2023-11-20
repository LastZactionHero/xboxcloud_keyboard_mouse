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
});