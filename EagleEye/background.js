function getToggle(callback) {
    // expects function(value){...}
    chrome.storage.local.get('toggle', function(data) {
        if (data.toggle === undefined) {
            callback(true); // default value
        } else {
            callback(data.toggle);
        }

        chrome.runtime.sendMessage({ toggle: data.toggle });
    });
}

function setToggle(value, callback) {
    // expects function(){...}
    chrome.storage.local.set({ toggle: value }, function() {
        if (chrome.runtime.lastError) {
            throw Error(chrome.runtime.lastError);
        } else {
            callback();
        }
    });
}

function setIcon(value) {
    var path = value ? 'img_on.png' : 'img_off.png';
    chrome.browserAction.setIcon({ path: path });
}

getToggle(setIcon); // Initial state

chrome.runtime.onMessage.addListener((message, sender, sendRes) => {
    if (message.type == 'toggle') {
        chrome.storage.local.get('toggle', o => {
            setIcon(o.toggle);
        });
    }
});

let data;
chrome.runtime.onMessage.addListener((message, sender, sendRes) => {
    switch (message.type) {
        case 'loadQuery':
            data = message.data;
            break;

        case 'getQueryFromDom':
            sendRes(data);
            break;

        default:
            console.log('There is no query present Currently');
            break;
    }
});
