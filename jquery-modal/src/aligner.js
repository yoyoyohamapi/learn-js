var $ = require('jquery');
var isFunction = require('./utils').isFunction;

var BASE_OPTIONS = {
    onChange: null
};

function _getTop() {
    // 获得自身高度
    var height = $(this).height();
    var windowHeight = $(window).height();

    var top = windowHeight < height ? $(this).css('top') :
        parseInt((windowHeight - height) / 2);
}


var methods = {
    /**
     * 初始化需要保证该DOM的位置为绝对位置
     */
    init: function (options) {
        return $(this).each(function (index, elem) {
            elem.aligner = {};
            elem.aligner._opts = $.extend({}, BASE_OPTIONS, options);
            var position = $(elem).css('postion');
            if (position !== 'absolute' || position !== 'fixed')
                $(elem).css('position', 'absolute');
        });
    },

    /**
     * 居中
     */
    center: function () {
        return $(this).each(function (index, elem) {
            if(!elem.aligner)
                $(elem).aligner();
            // 获得自身尺寸
            var width = $(elem).width();

            // 获得窗口尺寸
            var windowWidth = $(window).width();

            var left = windowWidth < width ? $(elem).css('left') :
                parseInt((windowWidth - width) / 2);

            var top = _getTop.call(elem);

            $(elem).css({
                'top': top,
                'left': left,
                'right': '',
                'bottom': ''
            });

            isFunction(elem.aligner._opts.onChange) && elem.aligner._opts.onChange();
        });
    },

    /**
     * 居左
     */
    toLeft: function () {
        return $(this).each(function (index, elem) {
            if(!elem.aligner)
                $(elem).aligner();
            var top = _getTop.call(elem);
            $(elem).css({
                'left': 0,
                'right': '',
                'top': top,
                'bottom': ''
            });
            isFunction(elem.aligner._opts.onChange) && elem.aligner._opts.onChange();
        });
    },

    /**
     * 居右
     */
    toRight: function () {

        return $(this).each(function (index, elem) {
            if(!elem.aligner)
                $(elem).aligner();
            var top = _getTop.call(elem);
            $(elem).css({
                'top': top,
                'left': '',
                'right': 0,
                'bottom': ''
            });
            isFunction(elem.aligner._opts.onChange) && elem.aligner._opts.onChange();
        });
    }

};


$.fn.aligner = function (method) {
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 0));
    } else if (!method || typeof method === 'object') {
        return methods.init.call(this, method);
    } else {
        $.error("wrong method!");
    }
};

module.exports = global.$ = $;