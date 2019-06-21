const switchElem = document.querySelector('[data-onoff]');

const disableBttn = (elems, is) => {
    elems.forEach(element => {
        element.style.pointerEvents = is;
    });
};

switchElem.addEventListener('change', e => {
    console.log(e.currentTarget.checked);
    if (e.currentTarget.checked) {
        chrome.storage.local.set({ toggle: true });
        disableBttn(document.querySelectorAll('.popup-button'), '');
    } else {
        chrome.storage.local.set({ toggle: false });
        disableBttn(document.querySelectorAll('.popup-button'), 'none');
    }
    chrome.runtime.sendMessage({ type: 'toggle' });
});

window.addEventListener('DOMContentLoaded', o => {
    chrome.storage.local.get('toggle', o => {
        switchElem.checked = o.toggle;
        if (o.toggle) {
            disableBttn(document.querySelectorAll('.popup-button'), '');
        } else {
            disableBttn(document.querySelectorAll('.popup-button'), 'none');
        }

        console.log(o.toggle);
    });
});
