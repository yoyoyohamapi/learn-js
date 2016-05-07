(function(win, doc){

    doc.domain = 'qcloud.com';

    var basePath = '//img.qcloud.com/qcloud/app/qcconsole_web/dest/';
    var loader = {
        load: function (url, cb) {
            var urlArr = [];
            if (typeof(url) == 'string') {
                urlArr.push(url);
            } else {
                urlArr = url;
            }
            var len = urlArr.length,
                callback = function () {
                    if (!--len) {
                        cb && cb();
                    }
                };
            for (var i = 0, url; url = urlArr[i]; i++) {
                this._load(url, callback);
            }
            while(core = urlArr.shift()) {
                this._load(core);
            }
            cb();
            for (var i = 0, url; url = urlArr[i]; i++) {
                this._load(url, callback);
            }
        },
        _load: function (url, cb) {
            var oldIe = /msie [\w.]+/.test(navigator.userAgent.toLowerCase());
            if (oldIe) {
                this._iframeLoad(url, cb);
            } else {
                this._scriptLoad(url, cb);
            }
        },
        _scriptLoad: function (url, cb) {
            var el = doc.createElement('script');
            el.setAttribute('type', 'text/javascript');
            el.setAttribute('src', basePath + url + '?max_age=20000000');
            el.setAttribute('async', true);
            el.onerror = function() {
                cb();
                el.onerror = null;
            };
            el.onload = el.onreadystatechange = function() {
                if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                    if (storeMode && seajs.modules) {
                        var modules = seajs.modules,
                            jsStr = '';
                        for (var key in modules) {
                            jsStr += 'define("' + key + '",' + modules[key] + ');';
                        }
                        try {
                            clearLocal(url);
                            localStorage[url] = jsStr;
                        } catch (e) {console.log(e)}

                        seajs.modules = {};
                    }
                    cb();
                    el.onload = el.onreadystatechange = null;
                }
            };
            doc.getElementsByTagName("head")[0].appendChild(el);
        },
        _iframeLoad: function (url, cb) {
            var iframe = doc.createElement('iframe');
            iframe.style.display = "none";
            iframe.src = 'javascript:void(function(){document.open();'+
                'document.domain = "' + doc.domain + '";document.close();}());';

            iframe.callback = function (jsStr) {
                eval(jsStr);
                if (storeMode) {
                    try {
                        clearLocal(url);
                        localStorage[url] = jsStr;
                    } catch (e) {}
                }
                cb();
                setTimeout(function () {
                    doc.body.removeChild(iframe);
                    iframe = null;
                }, 1000)

            };
            var iframeLoad = function () {
                var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                var iframeHtm = [
                    '<html><head><meta charset="utf-8"></head><body onload="callback()">',
                    '<script type="text/javascript">',
                    'var jsStr = "", cb = false;',
                    'var define = function (id, factory) {',
                    'if (typeof(factory) == "function") {',
                    'var factoryStr = factory.toString();',
                    'jsStr += "define(\'" + id + "\'," + factoryStr + ");"',
                    '}',
                    '};<\/script>',
                    '<script type="text/javascript" src="'+ basePath + url + '?max_age=20000000' +'"><\/script>',
                    '<script type="text/javascript">',
                    'function callback() {',
                    'if (jsStr && !cb) {',
                    'frameElement.callback(jsStr);',
                    'cb = true;',
                    '}',
                    '};',
                    'callback();',
                    '<\/script>',
                    '</body></html>'].join('');
                iframeDoc.open();
                iframeDoc.domain = doc.domain;
                iframeDoc.write(iframeHtm);
                iframeDoc.close();
            };

            if (iframe.attachEvent) {
                var _ifmLoad = function () {
                    iframe.detachEvent('onload', _ifmLoad);
                    iframeLoad();
                };
                iframe.attachEvent('onload', _ifmLoad);
            } else {
                iframe.onload = function () {
                    iframe.onload = null;
                    iframeLoad();
                }
            };

            doc.body.appendChild(iframe);
        }
    };

    function clearLocal (url) {
        for (var key in win.localStorage) {
            var urlName = url.substring(0, url.indexOf('.'));
            var stoName = key.substring(0, key.indexOf('.'));
            if (urlName == stoName) {
                localStorage.removeItem(key);
                break;
            };
        }
    }

    function configSeajs () {
        seajs.config({
            base: basePath,
            alias: {
                //nmc
                '$': 'nmc/lib/jquery-1.10.2',
                'util': 'nmc/lib/util',
                'net': 'nmc/lib/net',
                'twofactor': 'nmc/lib/twofactor',
                'event': 'nmc/lib/event',
                'reporter': 'nmc/lib/reporter',
                'nmcConfig': 'nmc/config/config',
                'dataManager': 'nmc/main/datamanager',
                'pageManager': 'nmc/main/pagemanager',
                'model': 'nmc/main/model',
                'router': 'nmc/main/router',
                'entry': 'nmc/main/entry',
                'dialog': 'nmc/widget/dialog',
                'tips': 'nmc/widget/tips',
                'dropdown': 'nmc/widget/dropdown',
                'selector': 'nmc/widget/selector',

                //external
                'daoConfig': 'models/dao_config',
                'manager': 'models/manager',
                'constants': 'config/constants',
                'appUtil': 'lib/appUtil',
                'panel': 'widget/panel/panel',
                'monitorchart': 'widget/monitorchart/monitorchart',
                'datepicker': 'lib/datepicker',
                'Highcharts':'lib/highcharts',
                'lengthlimiter': 'lib/lengthlimiter',
                'ZeroClipboard':'lib/ZeroClipboard',
                'Raphael':'lib/raphael',
                'sidebar': 'widget/menu/sidebar/sidebar',
                'login': 'widget/login/login',
                'regionSelector': 'widget/region/region',
                'projectsSelector': 'widget/projects/projects',
                'pagination': 'widget/pagination/pagination',
                'search': 'widget/search/search',
                'validator': 'widget/validator/validator',
                'contextmenu': 'widget/contextmenu/contextmenu',
                'startup': 'main/startup'
            }
        });
    }

    var coreJs = ['nmc.js', 'lib.js', 'app.js'];

    function isInCoreJs (name) {
        var isInArray = false;
        if (Array.prototype.indexOf) {
            isInArray = coreJs.indexOf(name) >= 0;
        } else {
            for (var i = 0; i < coreJs.length; i++) {
                if (coreJs[i] == name) {
                    isInArray = true;
                    break;
                }
            }
        }
        return isInArray;
    }

    /**
     * 核心: 加载模块
     */
    function loadModule () {

        // 配置seajs
        configSeajs();

        // 现在,我们区分两个模块队列

        var needLoadArr = [], // 需要加载的模块
            needEvalArr = []; // 需要执行的模块

        for (var name in jsVersion) {
            if (isInCoreJs(name)) {
                var loadName = getTargetName(name);
                if (storeMode) {
                    if (localStorage[loadName]) {
                        // 如果localStorage中已经存储了模块, 模块就不需要通过的网络请求获取并执行了
                        needEvalArr.push(loadName); // 待执行的模块
                    } else {
                        needLoadArr.push(loadName); // 待加载的模块
                    }
                } else {
                    needLoadArr.push(loadName);
                }
            }
        };

        function gettingStarted() {
            if (storeMode) {
                for (var i = 0, item; item = needEvalArr[i]; i++) {
                    eval(localStorage[item]);
                }
            };
            start();
        };

        // 先加载待加载的模块, 加载完成后, 如果浏览器支持localStorage, 该模块会缓存到localStorage
        // 同时, 脚本插入到文档的head标签中(自动执行), 到此, 待执行队列中的模块也开始执行
        // 脚本的预执行完成后, seajs开始执行入口模块
        if (needLoadArr.length) {
            loader.load(needLoadArr, gettingStarted);
        } else {
            gettingStarted();
        }
    }

    function start () {
        seajs.use('startup', function(app) {
            app.startup();
        });
    }

    function getTargetName (name) {
        var targetName;
        if (debug == 2) {
            targetName = name;
        } else {
            targetName = jsVersion[name];
        }
        return targetName;
    }

    function nmcLoad (name, cb) {
        var loadName = getTargetName(name);
        if (nmcLoad.loaded[loadName]) {
            cb && cb();
            return
        }
        if (storeMode && localStorage[loadName]) {
            eval(localStorage[loadName]);
            nmcLoad.loaded[loadName] = true;
            cb && cb();
        } else {
            seajs.modules = {};
            loader.load(loadName, function () {
                nmcLoad.loaded[loadName] = true;
                cb && cb();
            });
        }
    }

    nmcLoad.loaded = {};

    var locationHref = win.location.href,
        debug = 0,
        storeMode = 0;

    if (/\/debug_online/.test(locationHref)) {
        debug = 1;
    } else if (/\/debug_https/.test(locationHref)) {
        debug = 2;
    } else if (/\/debug_http/.test(locationHref)) {
        debug = 0;
    } else if (/\/debug/.test(locationHref)) {
        debug = 2;
    }

    if (win.localStorage && win.localStorage.getItem && !debug) {
        storeMode = 1;
    }

    win.startLoadJs = new Date();
    win.nmcLoad = nmcLoad;

    loadModule();

    if (!debug && location.href.indexOf('console.qcloud.com') > 0) {
        doc.write('<script type="text/javascript" src="//tajs.qq.com/stats?sId=38433323" charset="UTF-8"><\/script>');
        doc.write('<script type="text/javascript" src="//js.aq.qq.com/js/aq_common.js" charset="UTF-8"><\/script>');
    }

    if (top != this) {
        top.location.href = location.href;
    }

})(window, document);