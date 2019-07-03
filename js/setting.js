// Set All the JSON on html

const setCloseAction = o => {
    // After Appending the remove button on the html adding event listener directly to it and then the functionality
    const removeKeyElem = document.querySelectorAll('.removeKey');
    if (removeKeyElem) {
        removeKeyElem.forEach((elem, i) => {
            elem.addEventListener('click', e => {
                e.preventDefault();
                const currentTarget = e.currentTarget;
                chrome.storage.sync.get(o, p => {
                    const obj = JSON.parse(p[o]);
                    const key = currentTarget.parentNode.getAttribute('key');
                    let data = '';
                    delete obj[key];
                    data = JSON.stringify(obj);
                    chrome.storage.sync.set({ [o]: data });
                    setDataOnHtml(o);
                });
            });
        });
    }
};

const setDataOnHtml = o => {
    const ul = document.querySelector(`[p-list="${o}"]`);
    if (ul.offsetHeight > 0) {
        ul.innerHTML = '';
    }

    chrome.storage.sync.get(o, p => {
        const data = p[o] ? JSON.parse(p[o]) : '';
        if (data) {
            const entriesFromJson = Object.entries(data);

            entriesFromJson.reduce((a, [key, value]) => {
                const li = document.createElement('li');
                li.setAttribute('key', key);

                const htm = `<span>${key}</span>: <span>${value}</span><span class="removeKey">❌</span>`;
                li.innerHTML = htm;
                ul.appendChild(li);
            }, 0);
            setCloseAction(o);
        }
    });
};

const saveChanges = a => {
    const _ = {
        key: document.querySelector(`[s-key="${a}"]`).value,
        value: document.querySelector(`[s-value="${a}"]`).value
    };
    chrome.storage.sync.get(a, o => {
        let data = o[a] || '';
        const obj = data ? JSON.parse(data) : {};
        if (obj) {
            if (!_.key || !_.value) {
                alert('Please Enter Valid Inputs');
                return;
            }

            const uniquePairs = `"${_.key}":"${_.value}"`;
            const uniqueKey = `${_.key}`;
            if (data.includes(uniquePairs)) {
                alert(
                    'These inputs are already added! please try another inputs'
                );
                return;
            }

            if (data.includes(uniqueKey)) {
                alert('Please keep the key Unique');
                return;
            }

            obj[_.key] = _.value;
            data = JSON.stringify(obj);
            chrome.storage.sync.set({ [a]: data });
            setDataOnHtml(a);
        }
    });
};

document.querySelectorAll('[l-form]').forEach((item, index) => {
    item.addEventListener('submit', e => {
        e.preventDefault();
        const att = e.currentTarget.getAttribute('l-form');
        saveChanges(att);
    });
});

(e => {
    const content = ['checkpoints', 'validData'];
    content.forEach((i, o) => {
        setDataOnHtml(i);
    });

    const tabs = document.querySelectorAll('[p-tab]');
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
