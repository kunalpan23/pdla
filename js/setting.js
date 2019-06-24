const setDataOnHtml = () => {
    const ul = document.querySelector('[p-checkpoints]');
    if (ul.offsetHeight > 0) {
        ul.innerHTML = '';
    }

    chrome.storage.sync.get('checkpoints', ({ checkpoints }) => {
        const entriesFromJson = Object.entries(JSON.parse(checkpoints));

        entriesFromJson.reduce((a, [key, value]) => {
            const li = document.createElement('li');
            li.setAttribute('key', key);

            const htm = `<span>${key}</span>: <span>${value}</span><span class="removeKey">❌</span>`;
            li.innerHTML = htm;
            ul.appendChild(li);
        }, 0);

        // After Appending the remove button on the html adding event listener directly to it and then the functionality
        const removeKeyElem = document.querySelectorAll('.removeKey');
        removeKeyElem.forEach((elem, i) => {
            elem.addEventListener('click', e => {
                e.preventDefault();
                const currentTarget = e.currentTarget;
                chrome.storage.sync.get('checkpoints', o => {
                    const obj = JSON.parse(o.checkpoints);
                    const key = currentTarget.parentNode.getAttribute('key');
                    let data = '';
                    delete obj[key];
                    data = JSON.stringify(obj);
                    chrome.storage.sync.set({ checkpoints: data });
                    setDataOnHtml();
                });
            });
        });
    });
};

const saveChanges = () => {
    const key = document.querySelector('[s-input="key"]').value;
    const value = document.querySelector('[s-input="value"]').value;
    chrome.storage.sync.get('checkpoints', o => {
        let data = o.checkpoints;
        const obj = JSON.parse(o.checkpoints);
        if (!key || !value) {
            alert('Please Enter Valid Inputs');
            return;
        }

        const uniquePairs = `"${key}":"${value}"`;
        const uniqueKey = `${key}`;
        if (data.includes(uniquePairs)) {
            alert('These inputs are already added! please try another inputs');
            return;
        }

        if (data.includes(uniqueKey)) {
            alert('Please keep the key Unique');
            return;
        }

        obj[key] = value;
        data = JSON.stringify(obj);
        chrome.storage.sync.set({ checkpoints: data });

        setDataOnHtml();
    });
};

document.querySelector('.form-setting').addEventListener('submit', e => {
    e.preventDefault();
    e.stopPropagation();
    saveChanges();
});

(e => {
    setDataOnHtml();
})();
