var $ = require('jquery');
var isFunction = require('./utils').isFunction;

var BASE_OPTIONS = {
    // 默认为全页dimmer
    isPage: true,
    // 默认鼠标单击可关闭
    closable: true
};

var Z_INDEX = 1000;

var DIMMER_CSS = {
    display: 'none',
    opacity: 0,
    position: 'absolute',
    width: '100%',
    height: '100%',
    'z-index': Z_INDEX,
    'text-align': 'center',
    'vertical-align': 'middle',
    'background-color': 'rgba(0,0,0,.45)'
};

//
//function _getDimmer() {
//    return this.dimmer._opts.isPage ? $('body').children('[data-dimmer="true"]') :
//        $(this).children('[data-dimmer="true"]');
//}

function _adjustCSS() {
    this.attr('style', function (i, s) {
        return s + 'top: 0!important;left: 0!important'
    });
}

var methods = {
    init: function (options) {
        return $(this).each(function (index, elem) {
            elem.dimmer = {};
            elem.dimmer._opts = $.extend({}, BASE_OPTIONS, options);
            var $appendTo = elem.dimmer._opts.isPage ? $("body") : $(elem);
            var $dimmer = $(document.createElement('div'));
            $dimmer.attr('data-dimmer', 'true');
            $dimmer.css(DIMMER_CSS);
            _adjustCSS.call($dimmer);
            if (elem.dimmer._opts.isPage)
                $dimmer.css('position', 'fixed');
            $appendTo.append($dimmer);

            // 如果dimmer可关闭,则单击进行关闭
            $dimmer.click(function () {
                methods.hide.call(elem);
            });
            elem.dimmer.dimmer = $dimmer;
            elem.dimmer._dimmed = true;
        });
    },
    isHidden: function () {
        var elem = $(this)[0];
        return elem.dimmer && elem.dimmer._isHidden;
    },
    show: function () {
        return $(this).each(function (index, elem) {
            var $dimmer = elem.dimmer.dimmer;
            if ($dimmer.length) {
                // 显示前
                elem.dimmer._isHidden = false;
                isFunction(elem.dimmer._opts.onShow) && elem.dimmer._opts.onShow();
                $dimmer.css('display', 'block');
                $dimmer.css('opacity', 1);
            }
        });

    },
    hide: function () {
        return $(this).each(function (index, elem) {
            var $dimmer = elem.dimmer.dimmer;
            if ($dimmer.length) {
                elem.dimmer._isHidden = true;
                isFunction(elem.dimmer._opts.onHide) && elem.dimmer._opts.onHide();
                $dimmer.css('display', 'none');
                $dimmer.css('opacity', 0);
            }
        });
    },
    pureHide: function() {
        return $(this).each(function (index, elem) {
            var $dimmer = elem.dimmer.dimmer;
            if ($dimmer.length) {
                elem.dimmer._isHidden = true;
                $dimmer.css('display', 'none');
                $dimmer.css('opacity', 0);
            }
        });
    },
    toggle: function () {
        return $(this).each(function (index, elem) {
            if ($(elem).dimmer('isHidden')) {
                $(elem).dimmer('show');
            } else {
                $(elem).dimmer('hide');
            }
        });
    },
    getZIndex: function () {
        return Z_INDEX;
    },
    dimmed: function () {
        var elem = $(this)[0];
        return elem.dimmer && elem.dimmer._dimmed;
    }
};


$.fn.dimmer = function (method) {
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 0));
    } else if (!method || typeof method === 'object') {
        return methods.init.call(this, method);
    } else {
        console.log(method);
        $.error('wrong method');
    }
};

module.exports = global.$ = $;

