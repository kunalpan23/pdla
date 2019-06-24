const setDataOnHtml = () => {
    const ul = document.querySelector('[p-checkpoints]');
    if (ul.offsetHeight > 0) {
        ul.innerHTML = '';
    }
    // const getJsonFromStorage = JSON.parse(
    //     chrome.storage.sync.get('checkpoints', o => o.checkpoints)
    // );
    chrome.storage.sync.set(
        {
            checkpoints: `{"ctabtn":".ctabtn","title":"title","anchrortags":"a","link":"link","scripts":"scripts","att":"[data-event_tag]","id":"#overlay_template","tracker":"tracker","data_event-tag":"[data_event-tag]"}`
        },
        a => {
            const getJsonFromStorage = chrome.storage.sync.get(
                'checkpoints',
                o => o.checkpoints
            );
            console.log(getJsonFromStorage);
        }
    );

    // const entriesFromJson = Object.entries(getJsonFromStorage);

    // entriesFromJson.reduce((a, [key, value]) => {
    //     const li = document.createElement('li');
    //     li.setAttribute('key', key);

    //     const htm = `<span>${key}</span>: <span>${value}</span><span class="removeKey">❌</span>`;
    //     li.innerHTML = htm;
    //     ul.appendChild(li);
    // }, 0);

    // After Appending the remove button on the html adding event listener directly to it and then the functionality
    // const removeKeyElem = document.querySelectorAll('.removeKey');
    // removeKeyElem.forEach((elem, i) => {
    //     elem.addEventListener('click', e => {
    //         e.preventDefault();
    //         const obj =
    //             JSON.parse(
    //                 chrome.storage.sync.get('checkpoints', o => o.checkpoints)
    //             ) || {};
    //         const key = e.currentTarget.parentNode.getAttribute('key');
    //         let data = '';

    //         delete obj[key];
    //         data = JSON.stringify(obj);
    //         chrome.storage.sync.set({ checkpoints: data });
    //         setDataOnHtml();
    //     });
    // });
};

// const saveChanges = () => {
//     const key = document.querySelector('[s-input="key"]').value;
//     const value = document.querySelector('[s-input="value"]').value;
//     let data = chrome.storage.sync.get('checkpoints', o => o.checkpoints) || '';
//     const obj =
//         JSON.parse(
//             chrome.storage.sync.get('checkpoints', o => o.checkpoints)
//         ) || {};

//     if (!key || !value) {
//         alert('Please Enter Valid Inputs');
//         return;
//     }

//     const uniquePairs = `"${key}":"${value}"`;
//     const uniqueKey = `${key}`;
//     if (data.includes(uniquePairs)) {
//         alert('These inputs are already added! please try another inputs');
//         return;
//     }

//     if (data.includes(uniqueKey)) {
//         alert('Please keep the key Unique');
//         return;
//     }

//     obj[key] = value;
//     data = JSON.stringify(obj);
//     chrome.storage.sync.set({ checkpoints: data });

//     setDataOnHtml();
// };

document.querySelector('.form-setting').addEventListener('submit', e => {
    e.preventDefault();
    e.stopPropagation();
    saveChanges();
});

(e => {
    setDataOnHtml();
})();
