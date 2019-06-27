// Set All the JSON on html
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
        if (removeKeyElem) {
            removeKeyElem.forEach((elem, i) => {
                elem.addEventListener('click', e => {
                    e.preventDefault();
                    const currentTarget = e.currentTarget;
                    chrome.storage.sync.get('checkpoints', o => {
                        const obj = JSON.parse(o.checkpoints);
                        const key = currentTarget.parentNode.getAttribute(
                            'key'
                        );
                        let data = '';
                        delete obj[key];
                        data = JSON.stringify(obj);
                        chrome.storage.sync.set({ checkpoints: data });
                        setDataOnHtml();
                    });
                });
            });
        }
    });
};

const saveChanges = () => {
    const key = document.querySelector('[s-input="key"]').value;
    const value = document.querySelector('[s-input="value"]').value;
    chrome.storage.sync.get('checkpoints', o => {
        let data = o.checkpoints;
        const obj = data ? JSON.parse(data) : {};
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
        document.querySelector('[s-input="key"]').value = '';
        document.querySelector('[s-input="value"]').value = '';
        document.querySelector('[s-input="key"]').focus();
    });
};

document.querySelector('.form-setting').addEventListener('submit', e => {
    e.preventDefault();
    e.stopPropagation();
    saveChanges();
});

(e => {
    setDataOnHtml();

    const tabs = document.querySelectorAll('[p-tab]');
    document.querySelector('[s-input="key"]').focus();
    tabs.forEach((i, o) => {
        i.addEventListener('click', e => {
            e.preventDefault();
            const currentTarget = e.currentTarget;
            const att = currentTarget.getAttribute('p-tab');
            const ul = document.querySelector('[p-display]');
            tabs.forEach((a, b) => {
                a.classList.remove('active');
            });
            currentTarget.classList.add('active');
            switch (att) {
                case 'code':
                    ul.classList.add('active');
                    break;

                default:
                    ul.classList.remove('active');
            }
        });
    });
})();
