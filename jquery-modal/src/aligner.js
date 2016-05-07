var $ = require('jquery');
var utils = require('./utils');

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
    init: function () {
        return $(this).each(function (index, elem) {
            elem.aligner = {};
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
        });
    }

};


$.fn.aligner = function (method) {
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 0));
    } else if (!method) {
        return methods.init.apply(this);
    } else {
        $.error("wrong method!");
    }
};

module.exports = global.$ = $;