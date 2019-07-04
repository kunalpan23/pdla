const _ = {
    form: document.querySelector('#validate-form'),
    input: document.querySelector('.filter')
};

class App {
    constructor(val) {
        this.value = val;
    }

    isEmptyObject(obj) {
        const hasOwnProperty = Object.prototype.hasOwnProperty;
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return true;
            else return false;
        }
    }

    getStorageData() {
        chrome.storage.sync.get('validData', x => {
            const data = JSON.parse(x['validData']) || {};
            if (this.isEmptyObject(data)) {
                
            } else {
                const newURL = chrome.runtime.getURL('setting.html?code');
                window.open(newURL);
            }
        });
    }
}

(e => {
    _.form.addEventListener('submit', e => {
        e.preventDefault();
        const app = new App(_.input.value);
        app.getStorageData();
    });
})()