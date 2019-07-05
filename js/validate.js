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

    isSelfClosingTag(tagName) {
        return tagName.match(
            /area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script/i
        );
    }

    sortHTMLCode() {
        let html = '';
        switch (true) {
            case this.value.includes('@php'):
                const el = this.value.match(/<(.*?)>/gim);

                // Sort Out the HTML to validate
                const getBodyTag =
                    el.findIndex(obj => obj.includes('<body')) || 0;
                let count = getBodyTag;
                let headers = '';
                while (count > 0) {
                    count--;
                    headers += el[count];
                }

                html = `<!DOCTYPE html><html><head> ${headers}</head>`;

                for (let i = getBodyTag, len = el.length; i < len; i++) {
                    html += el[i];
                }
                break;
            case this.value.includes('<html'):
                html = this.value;
                break;

            default:
                break;
        }

        const tags = [];
        html.split('\n').forEach(function(line, i) {
            (line.match(/<[^>]*[^/]>/g) || []).forEach(function(tag, j) {
                const matches = tag.match(/<\/?([a-z0-9]+)/i);
                if (matches) {
                    tags.push({
                        tag: tag,
                        name: matches[1],
                        line: i + 1,
                        closing: tag[1] == '/'
                    });
                }
            });
        });
        if (tags.length == 0) {
            // $('#unclosed_results').text('No tags found.');
            console.log('No tags found.');
            return;
        }
        const openTags = [];
        let error = false;
        let indent = 0;
        for (let i = 0; i < tags.length; i++) {
            let tag = tags[i];
            if (tag.closing) {
                let closingTag = tag;
                if (this.isSelfClosingTag(closingTag.name)) {
                    continue;
                }
                if (openTags.length == 0) {
                    // $('#unclosed_results').addClass('output-error').text('Closing tag ' + closingTag.tag + ' on line ' + closingTag.line + ' does not have corresponding open tag.');
                    console.log(
                        'Closing tag ' +
                            closingTag.tag +
                            ' on line ' +
                            closingTag.line +
                            ' does not have corresponding open tag.'
                    );
                    return;
                }
                const openTag = openTags[openTags.length - 1];
                if (closingTag.name != openTag.name) {
                    // $('#unclosed_results').addClass('output-error').text('Closing tag ' + closingTag.tag + ' on line ' + closingTag.line + ' does not match open tag ' + openTag.tag + 'on line ' + openTag.line + '.');
                    console.log(
                        'Closing tag ' +
                            closingTag.tag +
                            ' on line ' +
                            closingTag.line +
                            ' does not match open tag ' +
                            openTag.tag +
                            'on line ' +
                            openTag.line +
                            '.'
                    );
                    return;
                } else {
                    openTags.pop();
                }
            } else {
                let openTag = tag;
                if (this.isSelfClosingTag(openTag.name)) {
                    continue;
                }
                openTags.push(openTag);
            }
        }
        if (openTags.length > 0) {
            let openTag = openTags[openTags.length - 1];
            // $('#unclosed_results')
            //     .addClass('output-error')
            //     .text(
            //         'Open tag ' +
            //             openTag.tag +
            //             ' on line ' +
            //             openTag.line +
            //             ' does not have a corresponding closing tag.'
            //     );

            console.log(
                'Open tag ' +
                    openTag.tag +
                    ' on line ' +
                    openTag.line +
                    ' does not have a corresponding closing tag.'
            );
            return;
        }
        console.log('Success: No unclosed tags found.');
    }

    getStorageData() {
        chrome.storage.sync.get('validData', x => {
            const data = JSON.parse(x.validData) || {};
            if (this.isEmptyObject(data)) {
                this.sortHTMLCode();
            } else {
                const newURL = chrome.runtime.getURL('setting.html?code');
                window.open(newURL);
            }
        });
    }
}

(e => {
    const _ = {
        form: document.querySelector('#validate-form'),
        input: document.querySelector('.filter'),
        clear_all: document.querySelector('.clear-all-code')
    };

    _.input.focus();

    _.form.addEventListener('submit', e => {
        e.preventDefault();
        const app = new App(_.input.value);
        app.getStorageData();
    });

    _.clear_all.addEventListener('click', e => {
        if (_.input.value.length > 0) {
            _.input.value = '';
        }
    });
})();
