'use strict';

(function () {

    // ---- start Demo Config ----

    function googleSearchImprovements() {

        function ggSetTimeRange() {
            var elemId = this.getAttribute('data-range');
            var timeLimit = document.querySelector('#' + elemId + ' a');
            if (timeLimit)
                timeLimit.click();
        }

        function ggReplaceAndSearch() {
            var kw = this.getAttribute('data-search');

            if (document.location.href.indexOf('chrome-search://') == 0 || document.location.href.indexOf('https://www.google.com/_/chrome/newtab?') == 0) {
                document.location.href = "https://www.google.com/search?q=" + encodeURIComponent(kw);
                return;
            }

            var inputText = document.querySelector('input[name="q"]');
            if (inputText) {
                setTimeout(function () {

                    var keyword = '' + inputText.value;
                    if (kw.indexOf('site:') >= 0 && keyword.indexOf('site:') >= 0) {
                        keyword = keyword.replace(/ *site:[^ ]+/, '');
                    }
                    else if (keyword.indexOf(kw) >= 0)
                        return;

                    kw = ' ' + kw;

                    if (kw.indexOf('site:') >= 0) {
                        inputText.value = keyword + ' ' + kw;

                        setTimeout(function () {
                            var btn = document.querySelector('form[action="/search"]');
                            if (btn) {
                                btn.submit();
                            } else {
                                btn = document.querySelector('button[name="btnK"]');
                                if (btn) {
                                    btn.click();
                                }
                            }
                        }, 100);
                    }
                    else {
                        inputText.value = kw + ' ' + keyword;

                        var strLength = ('' + inputText.value).length;
                        inputText.setSelectionRange(strLength, strLength);
                    }
                }, 200);

                setTimeout(function () {
                    inputText.focus();
                }, 100);

            };
        };

        var ggHelper = document.getElementById('ggHelper');
        if (!ggHelper) {
            var helperHtml = '<div id="ggHelper" style="position: fixed; ' +
					                'box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); ' +
					                'background-color: #f0f0f0; border-radius: 2px; flex: 1; ' +
					                'padding: 0.7em 1em 0.3em 1em; right: 1em; top: 12em; width: 13em; height: ' + (data.length + 4) + 'em; ' +
					                'font-size: 13px;">' +
		            '<ul style="list-style-type: none; margin: 0; padding: 0;">';

            data.forEach(function (dataItem) {
                helperHtml += '<li style="text-align: left; cursor: pointer;"><a href="javascript: return false;" data-search="' + dataItem.keywords + '" class="gg-keyword">' + dataItem.title + '</a></li>';
            });

            helperHtml += '<li style="margin: 0.5em;"><hr size="1" style="height: 1px; border-color: #e0e0e0;"></li>';
            helperHtml += '<li style="cursor: pointer;">' +
                '<a href="javascript: return false;" data-range="qdr_w" class="gg-range">week</a> :: ' +
                '<a href="javascript: return false;" data-range="qdr_m" class="gg-range">month</a> :: ' +
                '<a href="javascript: return false;" data-range="qdr_y" class="gg-range">year</a> :: ' +
                '<a href="javascript: return false;" data-range="qdr_" class="gg-range">any</a></li>';
            helperHtml += '</ul></div>';

            var bodyTag = document.querySelector('body');
            if (bodyTag) {
                var e = document.createElement('div');
                e.innerHTML = helperHtml;
                bodyTag.appendChild(e.firstChild);

                document.querySelectorAll('#ggHelper .gg-keyword').forEach(function (el) {
                    el.addEventListener('click', ggReplaceAndSearch);
                });

                document.querySelectorAll('#ggHelper .gg-range').forEach(function (el) {
                    el.addEventListener('click', ggSetTimeRange);
                });
            }
        }
    }

    function geektimesFilter() {
        function hideParent(el) {
            if (el.classList && el.classList.contains('post_teaser'))
                el.style.display = 'none';
            else if (el.parentElement)
                hideParent(el.parentElement);
        }

        function sanitizeParent(el) {
            if (el.classList && el.classList.contains('post_teaser')) {
                el.querySelectorAll('img').forEach(function (img) { img.style.display = 'none'; });
                el.querySelectorAll('.post__body_crop').forEach(function (chld) {
                    chld.style.maxHeight = '4em';
                    chld.style.overflow = 'hidden';

                    el.addEventListener('mouseover', function () {
                        chld.style.maxHeight = "inherit"; chl
                        d.querySelectorAll('img').forEach(function (img) {
                            img.style.display = 'block';
                        });
                    }, false);

                    el.addEventListener('mouseout', function () {
                        chld.style.maxHeight = "4em";
                        chld.querySelectorAll('img').forEach(function (img) {
                            img.style.display = 'none';
                        });
                    }, false);

                });

                el.querySelectorAll('.post__title a').forEach(function (titl) { titl.style.color = '#707040'; });

            } else if (el.parentElement)
                sanitizeParent(el.parentElement);
        }

        document.querySelectorAll('a[href*="https://geektimes.ru/hub/"]').forEach(function (el) {
            var hub = el.getAttribute('href').replace(/^.*\.ru\/hub\//, '').replace(/\/.*$/, '');
            if (data && data.hideHubs && data.hideHubs.indexOf(hub) >= 0)
                hideParent(el);
        });

        document.querySelectorAll('a[href*="https://geektimes.ru/company/"], a[href*="https://habrahabr.ru/company/"]').forEach(function (el) {
            var company = el.getAttribute('href').replace(/^.*\.ru\/company\//, '').replace(/\/.*$/, '');
            if (data) {
                if (data.hideCompanies && data.hideCompanies.indexOf(company) >= 0) {
                    hideParent(el);
                    return;
                } else if (data.showCompanies && data.showCompanies.indexOf(company) >= 0)
                    return;
            }

            sanitizeParent(el);
        });

    }

    function lorem() {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        var name = data.names[getRandomInt(0, data.names.length)];
        var hadEmail = false;

        var t = document.querySelectorAll('input[type=text], textarea');
        for (var i = 0, l = t.length; i < l; i++) {
            var e = t[i];
            var ro = e.getAttribute('readonly');

            if (e.disabled || ro === '' || ro == 'true' || ro == '1')
                continue;

            var loremTxt = data.lorem[getRandomInt(0, data.lorem.length)];
            var loremShort = data.loremShort[getRandomInt(0, data.loremShort.length)];

            var na = ('' + e.name).toLowerCase();
            var ia = ('' + e.id).toLowerCase();

            if (na == 'firstname' || ia == 'firstname' || na == 'fname' || ia == 'fname')
                e.value = name.firstName;
            else if (na == 'lastname' || ia == 'lastname' || na == 'lname' || ia == 'lname')
                e.value = name.lastName;
            else if (!hadEmail && (na.indexOf('email') >= 0 || ia.indexOf('email') >= 0)) {
                e.value = name.email;
                hadEmail = true;
            } else {
                e.value = (e.tagName == 'TEXTAREA' ? loremTxt : loremShort);
            }
        }
    }

    var googleDemoData = [
        {
            "keywords": "python",
            "title": "python"
        },
        {
            "keywords": "javascript",
            "title": "javascript"
        },
        {
            "keywords": "php",
            "title": "php"
        },
        {
            "keywords": "mysql",
            "title": "mysql"
        },
        {
            "keywords": "site:stackoverflow.com",
            "title": "at stackoverflow.com"
        },
        {
            "keywords": "site:developer.mozilla.org",
            "title": "at developer.mozilla.org"
        },
        {
            "keywords": "site:developer.chrome.com",
            "title": "at developer.chrome.com"
        },
        {
            "keywords": "site:habrahabr.ru",
            "title": "at habrahabr.ru"
        }
    ];

    var loremDemoData = {
        names: [
            { firstName: "Victoria", lastName: "Veit", email: "Victoria.Veit@noreply.ru" },
            { firstName: "Gisele", lastName: "Gillard", email: "Gisele.Gillard@noreply.ru" },
            { firstName: "Edmund", lastName: "Edelson", email: "Edmund.Edelson@noreply.ru" },
            { firstName: "Joey", lastName: "Janelle", email: "Joey.Janelle@noreply.ru" },
            { firstName: "Teodora", lastName: "Turek", email: "Teodora.Turek@noreply.ru" },
            { firstName: "Daniell", lastName: "Deer", email: "Daniell.Deer@noreply.ru" }
        ],
        lorem: [
            "Orem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sit amet purus condimentum, porta nulla sed, consequat felis. Phasellus quis condimentum odio. Maecenas scelerisque vehicula leo, sit amet tristique tellus molestie sed. Aenean lacus lorem, feugiat semper imperdiet a, vehicula ac orci. Pellentesque ac nisi commodo, pellentesque lorem quis, fringilla tellus. Fusce bibendum erat sit amet libero maximus rutrum. Integer dictum nibh sodales efficitur congue. Mauris nulla libero, hendrerit eget dictum nec, aliquam eu mi. Donec ipsum nisi, bibendum et consequat eu, imperdiet eget nisl. Duis tincidunt nibh et nibh tempor, quis mattis mi vulputate.",
            "Suspendisse quis eleifend lectus. Sed nec vehicula elit. Praesent ac sollicitudin diam. Nam at venenatis lectus. Fusce condimentum tortor nec augue vestibulum tempus. Nullam faucibus vehicula lorem, et mollis justo dapibus a. Proin sagittis velit in lectus vehicula, id eleifend urna hendrerit. Integer rhoncus dui sed enim sollicitudin, a finibus magna fermentum.",
            "Fusce at urna vitae magna semper scelerisque id volutpat tellus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed ut elit nisl. Duis sit amet ante accumsan nibh ultricies pharetra at vitae purus. Donec a felis eget ipsum euismod tempus. Donec elementum vel tortor vel efficitur. Nunc tristique, magna hendrerit sagittis placerat, odio sem commodo ligula, eu aliquam arcu elit sit amet diam. Etiam ultrices vehicula auctor.",
            "Praesent eleifend gravida justo eu rutrum. Curabitur bibendum imperdiet orci, et ornare est egestas vitae. Integer accumsan a dolor vitae volutpat. Integer quis sapien et magna luctus pretium in eu lectus. Etiam fringilla tellus eget ipsum sagittis maximus. In et euismod neque, ac vehicula lacus. In hac habitasse platea dictumst. Aliquam in ex a ante tempor mollis nec in elit. Nam laoreet augue id mauris accumsan auctor. Duis maximus sapien quis risus aliquam suscipit. In blandit euismod sapien id imperdiet. Morbi sit amet hendrerit orci, et fringilla nisi.",
            "Cras non magna vehicula, pharetra metus sit amet, convallis tortor. Morbi laoreet in erat ut eleifend. Cras pellentesque malesuada egestas. Aenean quis condimentum augue, faucibus hendrerit dolor. Donec tempor nunc id ante molestie, at hendrerit neque tincidunt. In ut quam quis ipsum mollis fringilla sit amet non mauris. Quisque enim odio, tincidunt in orci sed, pharetra convallis diam. Maecenas nec metus nec dolor mattis faucibus. Fusce dapibus placerat turpis, in maximus urna fringilla sed. Donec vestibulum orci sapien, sed ornare sem interdum vel.",
            "Cras non volutpat urna, sed tincidunt ex. Morbi nec sollicitudin augue. Vestibulum non rutrum ligula. Curabitur eget sapien nisi. Fusce congue tristique dui, posuere rhoncus elit scelerisque in. Etiam et ligula interdum urna vestibulum porta. Aliquam aliquam maximus nibh, ut interdum nunc consectetur ut. Duis pretium diam lacus. Aenean cursus ut nunc vel gravida. Pellentesque mollis facilisis leo, ac ullamcorper dolor ultrices nec. Vivamus vel urna eu metus lobortis posuere sit amet non dui. Etiam est felis, sodales at risus quis, interdum condimentum nibh."
        ],
        loremShort: [
            "Morbi nec sollicitudin augue.",
            "Suspendisse sagittis fringilla aliquam.",
            "Curabitur malesuada dolor.",
            "Praesent quis lacus neque. Duis vitae vehicula felis",
            "Vivamus pulvinar in tortor",
            "Luctus tincidunt eros",
            "Duis quis ultrices condimentum nibh",
            "Tincidunt sed libero vel gravida.",
            "Ut porta tortor neque.",
            "Phasellus non orci sagittis, suscipit.",
            "Vel ultrices nibh iaculis non. Maecenas."
        ]
    };

    function stripFunctionBody(s) {
        return ('' + s).replace(/^[^{]*{/, '').replace(/}[^}]*$/, '');
    }

    var demoItems = [
        {
            name: 'Google Search improvements',
            url: '^(https?://www.google.[a-z]{2,3}(/$|/web|/search|/#)|chrome://newtab)',
            source: stripFunctionBody(googleSearchImprovements),
            id: 'act-11001', sourceType: 'JS', editSource: '', data: JSON.stringify(googleDemoData, null, 4), dataType: 'JSON', execute: 'Page loaded', output: 'Owner tab', editMode: false
        },
        {
            name: 'Habrahabr CSS',
            url: '^https?://[^/]*(habrahabr|geektimes)\\.ru',
            sourceType: 'InjectCSS',
            execute: 'Popup menu',
            id: 'act-12002', source: '', editSource: '', data: '* { color: #c0c000 !important; background: black !important; }', dataType: 'CSS', output: 'Owner tab', editMode: false
        },
        {
            name: 'Contrast CSS',
            sourceType: 'InjectCSS',
            url: '.*',
            execute: 'Context menu',
            id: 'act-13003', source: '', editSource: '', data: '* { color: #ffffff !important; background: black !important; }', dataType: 'CSS', output: 'Active tab', editMode: false
        },
        {
            name: 'Lorem Form',
            sourceType: 'JS',
            url: '.*',
            execute: 'Short-cut (Ctrl-Q)',
            id: 'act-14004', source: stripFunctionBody(lorem), editSource: '', data: JSON.stringify(loremDemoData, null, 4), dataType: 'JSON', output: 'Active tab', editMode: false
        },
        {
            name: 'Geektimes',
            url: '^https?://[^/]*(habrahabr|geektimes)\\.ru',
            source: stripFunctionBody(geektimesFilter),
            execute: 'Delayed 5 sec.',
            dataType: 'JSON',
            data: JSON.stringify({ showCompanies: ['yandex', 'mosigra'], hideCompanies: ['hashflare'], hideHubs: ['lib'] }, null, 4),
            id: 'act-15005', sourceType: 'JS', editSource: '', output: 'Owner tab', editMode: false
        }
    ];

    // ---- end Demo Config ----

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


    var availableTemplates = ko.observableArray([
    {
        name: 'Custom JavaScript',
        sourceType: 'JS',
        editableByDefault: true,
        dataType: 'None'
    },
    {
        name: 'Template: Hide by JQuery selectors',
        sourceType: 'HideJQuery',
        editableByDefault: true,
        dataType: 'Text'
    },
    {
        name: 'Template: Alert',
        sourceType: 'Alert',
        editableByDefault: true,
        dataType: 'Text',
        data: 'Alert!'
    },
    {
        name: 'Template: Inject CSS',
        sourceType: 'InjectCSS',
        editableByDefault: true,
        dataType: 'CSS'
    }
    ]);

    function optionsViewModel() {
        var self = this;

        self.status = ko.observable('');
        self.templates = availableTemplates;
        self.outputOptions = ['Owner tab', 'Active tab'];
        self.dataTypes = ['None', 'Text', 'JSON', 'Html', 'CSS', 'Xml', 'XPath'];
        self.executeOptions = ['Page loaded', 'On before load', 'Page loading', 'Popup menu', 'Context menu', 'Delayed 1 sec.', 'Delayed 5 sec.', 'Short-cut (Ctrl-B)', 'Short-cut (Ctrl-Q)', 'Short-cut (Ctrl-Y)'];

        function itemModel() {

        }

        function newItem() {
            var item = {
                id: ko.observable('act-' + parseInt(new Date().getTime() / 1000)),
                name: ko.observable(''),
                url: ko.observable(''),
                sourceType: ko.observable('JS'),
                source: ko.observable(''),
                editSource: ko.observable(''),
                data: ko.observable(''),
                dataType: ko.observable('none'),
                execute: ko.observable('Page loaded'),
                output: ko.observable('Owner tab'),
                editMode: ko.observable(true)
            };

            item.getTemplateSource = ko.computed(function () {
                return stripFunctionBody(getTemplate(this.sourceType()));
            }, item);

            return item;
        }

        self.items = ko.observableArray([newItem()]);

        self.save = function () {
            ko.utils.arrayForEach(self.items(), function (e) { e.editMode(false); });

            var items = { actions: JSON.parse(ko.mapping.toJSON(self.items())) };

            chrome.storage.local.set(items, function () {
                self.status('Items saved.');
                setTimeout(function () { self.status(''); }, 750);
                chrome.runtime.sendMessage({ command: 'refreshConfig' });
            });
        };

        function addItems(items)
        {
            self.items.removeAll();

            items.forEach(function (item) {
                item.editMode = false;
                var koItem = ko.mapping.fromJSON(JSON.stringify(item));

                    koItem.getTemplateSource = ko.computed(function () {
                        return stripFunctionBody(getTemplate(this.sourceType()));
                    }, koItem);

                    self.items.push(koItem);
             });
        }

        self.delete = function (data) {
            if (confirm('Are you sure you want to delete the action?'))
                self.items.remove(data);
        };

        self.edit = function (data) {
            data.editMode(true);
        };

        self.add = function (data) {
            data.items.push(newItem());
            window.scrollTo(0, document.body.scrollHeight);
        };

        self.demo = function (data) {
            addItems(demoItems);
        };

        self.toggleSource = function (data, event) {
            var pre = event.target.parentElement.querySelector('pre');
            pre.style.display = 'block';
        }

        chrome.storage.local.get('actions', function (items) {
            if (items && items.actions && items.actions.length > 0) {

                addItems(items.actions);

                if (window.location.search.indexOf("?url=") == 0) {
                    var match = decodeURIComponent(window.location.search).match(/^\?url=https?:\/\/([^\/]+)\//i);
                    if (match && match.length > 0) {
                        var addSite = newItem();
                        addSite.name(match[1]);
                        addSite.url('^https?://' + match[1] + '/');
                        self.items.push(addSite);
                        window.scrollTo(0, document.body.scrollHeight);
                    }
                }
            }
        });
    }

    ko.applyBindings(new optionsViewModel());

})();
