'use strict';

(function () {

    // ---- start Templates ----

    function templateAlert() {
        alert(data);
    }

    function templateHideJQuery() {
        if (data && data.length > 0)
            $(data).hide();
    }

    function getTemplate(name) {
        switch (name) {
            case 'HideJQuery':
                return templateHideJQuery;

            case 'Alert':
                return templateAlert;

            default:
                return '';
        }
    }

    // ---- end Templates ----

    var items = [];

    var shortCutB = null;
    var shortCutQ = null;
    var shortCutY = null;

    function stripFunctionBody(s) {
        return ('' + s).replace(/^[^{]*{/, '').replace(/}[^}]*$/, '');
    }

    function executeScript(item, tabId) {
        if (item.sourceType == 'InjectCSS') {
            if (item.data && item.data.length > 0)
                chrome.tabs.insertCSS(item.output == 'Owner tab' ? tabId : null, { code: item.data });
        } else {
            var dataSrc = 'null';
            if (item.data && item.data.length > 0) {
                if (item.dataType == 'JSON')
                    dataSrc = item.data;
                else
                    dataSrc = JSON.stringify(item.data);
            }

            var itemSource = item.sourceType == 'JS' ? item.source : stripFunctionBody(getTemplate(item.sourceType));

            var delayed = (item.execute == 'Delayed 1 sec.' ? 1000 : (item.execute == 'Delayed 5 sec.' ? 5000 : 0));
            var src = '(function() {' +
                'var data = ' + dataSrc + ';' +
                (delayed > 0 ? 'setTimeout(function() {' : '') +
                itemSource +
                (delayed > 0 ? '},' + delayed + ');' : '') +
                '})();';

            chrome.tabs.executeScript(item.output == 'Owner tab' ? tabId : null, { code: src });
        }
    }

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

        var url = '';
        if (changeInfo && changeInfo.url)
            url = changeInfo.url.toLowerCase();
        else if (tab && tab.url)
            url = tab.url.toLowerCase();

        items.forEach(function (item) {
            if (item.regexUrl.test(url)) {
                var exe = item.execute;
                var doExec = (changeInfo && (
                                                (changeInfo.status == 'complete' && (exe == 'Page loaded' || exe == 'Delayed 1 sec.' || exe == 'Delayed 5 sec.'))
                                                || (changeInfo.status == 'loading' && exe == 'Page loading')
                ));

                if (doExec) {
                    executeScript(item, tabId);
                    console.log(url);
                }
            }
        });

    });

    var hadContextMenu = false;

    function refreshConfig() {
        var addContextMenu = [];
        shortCutB = null;
        shortCutQ = null;
        shortCutY = null;

        chrome.storage.local.get('actions', function (data) {
            if (data && data.actions && data.actions.length > 0) {
                items = data.actions;
                items.forEach(function (item) {
                    try {
                        item.regexUrl = new RegExp(item.url, 'i');
                        if (item.execute == 'Context menu')
                            addContextMenu.push(item);
                        else if (item.execute == 'Short-cut (Ctrl-B)')
                            shortCutB = item;
                        else if (item.execute == 'Short-cut (Ctrl-Q)')
                            shortCutQ = item;
                        else if (item.execute == 'Short-cut (Ctrl-Y)')
                            shortCutY = item;
                    } catch (ex) { }
                });
            }

            if (hadContextMenu || addContextMenu.length > 0) {
                chrome.contextMenus.removeAll(function () {
                    addContextMenu.forEach(function (item) {
                        chrome.contextMenus.create({ id: item.id, contexts: ["page", "frame", "selection"], title: item.name, onclick: function (info, tab) { onCommand(info.menuItemId); } });
                    });

                    hadContextMenu = (addContextMenu.length > 0);
                });
            }
        });
    }

    function executeOnActiveTab(item) {
        chrome.tabs.query({ active: true, currentWindow: true },
            function (currentTabs) {
                if (currentTabs && currentTabs.length > 0 && currentTabs[0].url.indexOf('chrome://') != 0 && item.regexUrl.test(currentTabs[0].url)) {
                    var clone = JSON.parse(JSON.stringify(item));
                    clone.actualUrl = currentTabs[0].url;
                    executeScript(clone, currentTabs[0].id);
                }
            });
    }

    function onCommand(command) {
        console.log('Command:', command);

        if (command == 'refreshConfig') {
            refreshConfig();
            return;
        } else if (command && command.indexOf('act-') == 0) {

            items.filter(function (i) { return i.id == command; }).forEach(function (item) {
                setTimeout(function () {
                    executeOnActiveTab(item);
                },
                    0);
            });
        } else if (command == 'cmd-exec-1' && shortCutQ)
            executeOnActiveTab(shortCutQ);
        else if (command == 'cmd-exec-2' && shortCutB)
            executeOnActiveTab(shortCutB);
        else if (command == 'cmd-exec-3' && shortCutY)
            executeOnActiveTab(shortCutY);
    };

    chrome.commands.onCommand.addListener(onCommand);

    chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
          onCommand(request.command);
      });

    refreshConfig();

})();


