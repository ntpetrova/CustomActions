'use strict';

(function () {

    function sendCommand(command) {
        chrome.runtime.sendMessage({ command: command });
        window.close();
    }

    function click(e) {
        var actId = e.target.getAttribute("data-actid");
        if (actId)
            sendCommand(actId);
    }

    function onReady() {

        document.getElementById("preferences").addEventListener('click', function () {
            chrome.tabs.create({ url: 'options.html' });
        });

        document.getElementById("addThisSite").addEventListener('click', function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (currentTabs) {
                chrome.tabs.create({ url: 'options.html?url=' + encodeURIComponent(currentTabs[0].url) });
            });
        });

        chrome.storage.local.get('actions',
            function (items) {
                if (!items || !items.actions)
                    return;

                chrome.tabs.query({ active: true, currentWindow: true },
                    function (currentTabs) {

                        var url = '';
                        if (currentTabs && currentTabs.length > 0)
                            url = currentTabs[0].url;

                        var found = false;

                        items.actions.forEach(function (item) {
                            if (item.execute == 'Popup menu') {
                                var regEx = new RegExp(item.url, 'i');
                                if (regEx.test(url)) {
                                    var el = document.createElement("div");
                                    el.innerText = item.name;
                                    el.setAttribute('data-actid', item.id);
                                    document.getElementById("actions").appendChild(el);
                                    el.addEventListener('click', click);
                                    found = true;
                                }
                            }
                        });

                        if (!found)
                            document.getElementById('prefHr').style.display = 'none';

                        document.getElementById('addThisSite').style.display = (/^https?:\/\//.test(url) ? 'block' : 'none');
                    });
            });
    }

    document.addEventListener('DOMContentLoaded', onReady);

})();
