const __button = document.querySelectorAll('[p-button]');
let __location = window.location;
console.log(__location);
__button.forEach((e, o) => {
    e.addEventListener('click', e => {
        try {
            const __targetAtt = e.currentTarget.getAttribute('p-button');
            console.log(__targetAtt);

            switch (__targetAtt) {
                case 'test':
                    console.log('Running Test Please wait');
                    chrome.tabs.query(
                        { active: true, currentWindow: true },
                        function(tabs) {
                            chrome.tabs.sendMessage(
                                tabs[0].id,
                                { action: 'getDom' },
                                function(response) {
                                    console.log(response.dom);
                                }
                            );
                        }
                    );
                    break;

                case 'validate':
                    console.log('Validtion.html Open');

                    __location = `${__location.origin}/validate.html`;
                    window.open(__location, '_blank');
                    break;

                case 'help':
                    console.log('Help Page is opening');
                    __location = `${__location.origin}/help.html`;
                    window.open(__location, '_blank');
                    break;

                case 'setting':
                    console.log('Help Page is opening');
                    __location = `${__location.origin}/setting.html`;
                    window.open(__location, '_blank');
                    break;
            }
        } catch (e) {
            console.log(e);
        }
    });
});

(e => {})();
