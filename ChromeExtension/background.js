document.onmouseup = function() {
    chrome.tabs.getCurrent(function(_tabId) {
        if (_tabId) {
            var _SELECTION = {};
            _SELECTION[tabId] = window.getSelection().toString();
            chrome.storage.local.set(_SELECTION, function() {
                console.log('Selection saved: ', _SELECTION[tabId]);
            });
        }
    });
};