const queries = {
    isProd: false
};
class App {
    appToggle = false;
    details = {
        process: '',
        flag: true,
        elemJson: '',
        list: ''
    };
    checkpoints = JSON.parse(
        chrome.storage.sync.get('checkpoints', o => o.checkpoints)
    );

    //     {
    //     ctabtn: '.ctabtn',
    //         title: 'title',
    //             anchrortags: 'a',
    //                 link: 'link',
    //                     scripts: 'script',
    //                         att: '[data-event_tag]',
    //                             id: '#overlay_template'
    // }
    constructor() {}

    setTextForHideAndShow(e) {
        const action = document.querySelector(`[p-action="${e}"]`);
        action.textContent = `${e} All`;
    }

    activateAccordian() {
        const button = document.querySelectorAll('[p-results] .button');
        const actions = document.querySelectorAll('[p-action]');
        button.forEach((i, o) => {
            i.addEventListener('click', e => {
                e.currentTarget.parentNode
                    .querySelector('ul')
                    .classList.toggle('active');
            });
        });

        actions.forEach((e, i) => {
            e.addEventListener('click', e => {
                const eventAttribte = e.currentTarget.getAttribute('p-action');
                switch (eventAttribte) {
                    case 'Show':
                        document
                            .querySelectorAll('[p-eagleeye] ul')
                            .forEach((e, i) => {
                                e.classList.add('active');
                            });
                        e.currentTarget.setAttribute('p-action', 'Hide');
                        break;
                    case 'Hide':
                        document
                            .querySelectorAll('[p-eagleeye] ul')
                            .forEach((e, i) => {
                                e.classList.remove('active');
                            });
                        e.currentTarget.setAttribute('p-action', 'Show');
                        break;

                    case 'close':
                        document.querySelector('[p-eagleeye]').style.display =
                            'none';
                        break;
                }
                this.setTextForHideAndShow(
                    e.currentTarget.getAttribute('p-action')
                );
            });
        });
    }

    appendChildDynamic(container, elem) {
        container.appendChild(elem);
    }

    loopThrough() {
        const parentUl = document.querySelector('[p-results]');
        let tagCount = 0;
        let attrCount = 0;
        console.log(this.details.list);
        for (let x in this.details.list) {
            console.log(this.details.list);
            const li = document.createElement('li');
            const div = document.createElement('div');
            div.classList.add('button');
            // div.innerHTML = `${x}: Tags => <span class="tagcount${x}">${tagCount}</span>`;
            div.innerHTML = `${x}: Tags => <span class="tagcount${x}"></span>`;

            this.appendChildDynamic(li, div);

            const ul = document.createElement('ul');
            this.appendChildDynamic(li, ul);
            ul.classList.add('sub-ul');

            if (this.details.list[x].length) {
                this.details.list[x].forEach(element => {
                    const li2 = document.createElement('li');
                    const div1 = document.createElement('div');
                    div1.classList.add('button');

                    for (let a in element) {
                        tagCount++;

                        div1.innerHTML =
                            a || element
                                ? `Tag Name: <span class="bold">${a}</span>`
                                : 'No Data Found';
                        this.appendChildDynamic(li2, div1);
                        // Appending or BUTTON TAGs

                        const newUl = document.createElement('ul');
                        newUl.classList.add('sub_ul');
                        this.appendChildDynamic(li2, newUl);

                        for (let e in element[a]) {
                            attrCount++;
                            const li3 = document.createElement('li');
                            const div2 = document.createElement('div');
                            div2.innerHTML =
                                x || element[a][e]
                                    ? `<span class="bold">${e}: </span>${
                                          element[a][e]
                                      }`
                                    : 'No Data Found';
                            // debugger;
                            this.appendChildDynamic(li3, div2);
                            this.appendChildDynamic(newUl, li3);
                        }
                    }
                    this.appendChildDynamic(ul, li2);
                });
            } else {
                const li2 = document.createElement('li');
                const div = document.createElement('div');
                div.textContent = 'No Data Found';
                this.appendChildDynamic(li2, div);
                this.appendChildDynamic(ul, li2);
            }
            this.appendChildDynamic(parentUl, li);
            document.querySelector(`.tagcount${x}`).textContent = tagCount;
            tagCount = 0;
        }

        this.activateAccordian();
    }

    appendPopup() {
        const body = document.querySelector('body');
        const html = `
                        <style>                           
                            .popup-wrap{
                                position: fixed;
                                top:0;
                                right:0;
                                bottom:0; 
                                left:0;
                                display: flex;
                                justify-content:center;
                                align-items:center;
                                background:rgba(0,0,0,0.6);
                                z-index: 999;
                            } 
                            [p-eagleeye] *{
                                padding: 0; 
                                margin: 0;
                                list-style:none;
                            }
                            [p-eagleeye] .popup-inner{ 
                                padding:10px;
                                width:70%;
                                border:1px solid #eee;
                                box-sizing: border-box;
                                border-radius: 5px;
                                background: #fff;
                                height: 80%;
                            }

                            [p-eagleeye] .popup-header{
                                font-size: 22px;
                                font-weight: 700;
                                font-family: cursive;
                                line-height: 48px;
                            } 

                            [p-results]{
                                font-family: cursive;
                                padding-right:10px;
                            }

                            [p-results] > li{
                                margin-bottom: 10px;
                            }

                            [p-results] .button {
                                cursor: pointer;
                            }

                            [p-results] > li > .button{
                                display: block;
                                padding:10px;
                                border-bottom: 1px solid #333;
                                border-radius: 3px;
                                background-color: #adadad; 
                                transition: 250ms ease all ;
                                text-transform: uppercase;
                            }
                            [p-results] .bold{
                                font-weight: bold;
                            }

                            [p-results] li ul{
                                height: 0;
                                overflow: hidden;
                                transition: 250ms ease all ;
                            }

                            [p-results] .sub-ul li > div.button{
                                padding: 5px 15px;
                                border-bottom:1px solid #666;
                                transition: 250ms ease all ;
                                background: #3c3c3c;
                                color: #fff;
                            }

                            [p-results].sub_ul li:last-child > div{
                                border-bottom:none;
                                transition: 250ms ease all ;
                            }

                            [p-results] .sub_ul li {
                                padding: 0 20px;
                                transition: 250ms ease all ;
                            }
                            [p-results] .sub_ul li > div {
                                padding: 5px 0;
                                border-bottom: 1px dashed #777;
                                transition: 250ms ease all ;
                            }
                            [p-results] ul.active{
                                height :auto!important;
                                transition: 250ms ease all ;
                            }
                            [p-eagleeye] .popup-results{
                                overflow: auto;
                                height: calc(100% - 48px);
                            }

                            [p-eagleeye] .popup-results::-webkit-scrollbar {
                                width: 8px;
                            }
                        
                            [p-eagleeye] .popup-results::-webkit-scrollbar-track {
                                box-shadow: inset 0 0 9px grey; 
                                border-radius: 10px;
                            }
                            
                            /* Handle */
                            [p-eagleeye] .popup-results::-webkit-scrollbar-thumb {
                                background: #333; 
                                border-radius: 10px;
                            }

                            /* Handle on hover */
                            [p-eagleeye] .popup-results::-webkit-scrollbar-thumb:hover {
                                background: #444; 
                            }
                            [p-eagleeye] .rigthElem{
                                position: relative; 
                                float: right;
                            }

                            [p-eagleeye] .rigthElem span{
                                display: inline-block;
                                margin-right: 5px;
                                font-size: 13px;
                                font-family: cursive;
                                font-weight: bold;
                                line-height: 17px;
                            }

                            [p-eagleeye] .rigthElem span:hover{
                                text-decoration: underline;
                                cursor: pointer;
                            }
                        </style>
                        <div class="popup-inner">
                        <div class="popup-header">
                        There You Go!
                        <div class="rigthElem"> 
                            <span p-action="Show">Show All </span> 
                            <span p-action="close"> Close Popup </span>
                        </div>
                        </div>
                        <div class="popup-results">
                        <ul p-results>
                            
                        </ul>
                        </div>
                        </div>`;

        if (document.querySelector('[p-eagleeye]')) {
            document
                .querySelector('[p-eagleeye]')
                .parentNode.removeChild(document.querySelector('[p-eagleeye]'));
        }
        const popup = document.createElement('div');
        popup.classList.add('popup-wrap');
        popup.setAttribute('p-eagleeye', '');
        body.appendChild(popup);
        popup.innerHTML = html;

        this.loopThrough();
    }

    filterDomAndSetJson() {
        this.details.elemJson = Object.entries(this.checkpoints).reduce(
            (a, [cat, elem]) => {
                // console.log('categories', cat);
                a[cat] = Array.prototype.filter.call(
                    document.querySelectorAll(elem),
                    el => {
                        return el;
                    }
                );
                return a;
            },
            {}
        );
        const OBJECTENTRIES = Object.entries(this.details.elemJson);

        this.details.list = OBJECTENTRIES.reduce((acc, [cat, items]) => {
            const itemsObj = items.reduce((acc, item, i) => {
                const tagName = {};
                const elemJson = {};
                // Returns you the element's attributes
                for (let a = 0, len = item.attributes.length; a < len; a++) {
                    elemJson[item.attributes[a].name] =
                        item.attributes[a].value;
                    tagName[item.tagName] = elemJson;
                }
                elemJson.elementText = item.innerText.trim()
                    ? item.innerText
                    : 'SORRY NO DATA FOUND 😓';
                tagName[item.tagName] = elemJson;

                acc.push(tagName);

                return acc;
            }, []);

            acc[cat] = itemsObj;

            return acc;
        }, {});

        console.log(this.details.elemJson);

        this.appendPopup();
    }

    renderLocation() {
        const location = window.location;

        // Need to check if the Test Is going to run on the production link or the local link or live link
        switch (true) {
            // Is localHost Link
            case location.href.includes('localhost:'):
                this.details.process = 'dev';
                break;

            // Is extensionslabs link
            case location.href.includes('extensionslabs'):
                this.details.process = 'prod';
                break;

            // is live link
            default:
                this.details.process = 'live';
                break;
        }

        if (
            (this.details.process == 'live' ||
                this.details.process == 'prod') &&
            !location.href.includes('log')
        ) {
            location.href = `${location.href}${
                location.href.includes('?') ? '&' : '?'
            }log`;
        }

        chrome.storage.local.get('toggle', o => {
            if (o.toggle) {
                this.filterDomAndSetJson();
            }
        });
    }

    checkToggle(toggle) {
        if (toggle) {
            this.appToggle = toggle;
            this.renderLocation();
            console.log('this is appToggle', this.appToggle);
        }
    }
}

const app = new App();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == 'getDom') {
        sendResponse({ dom: 'Dom is working fine' });
        app.checkToggle(true);
    } else {
        sendResponse({});
    }
});

// window.addEventListener('DOMContentLoaded', () => {
//     chrome.storage.local.set({ data: queries });
// });
