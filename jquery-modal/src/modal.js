require('./dragger');

require('./aligner');

require('./dimmer');

var isFunction = require('./utils').isFunction;

var BASE_OPTIONS = {
    // 设定拖动区域
    dragRegion: null,

    // 是否允许多模态框
    // 允许: 第二个模态框在第一个之上弹出
    // 不允许: 首先关闭第一个模态框,再弹出接下来的模态框
    multiple: false,

    // 显示时的回调
    onShow: null,

    // 显示完成的回调
    onShowed: null,

    // 隐藏时的回调:
    onHide: null,

    // 隐藏完成的回调
    onHidden: null,

    // 开始拖拽时的回调
    onStart: null,

    // 拖拽时的回调
    onMove: null,

    // 拖拽结束时的回调
    onDrop: null
};


var modals;
var multiMode;

var methods = {

    init: function (options) {
        return $(this).each(function (index, elem) {
            elem.modal = {};
            modals = modals || {};

            // 初始化配置
            elem.modal._opts = $.extend({}, BASE_OPTIONS, options);

            // 该元素可拖动及定位, 为其附加上全页dimmer
            $(elem).dragger({
                region: elem.modal._opts.dragRegion,
                onStart: elem.modal._opts.onStart,
                onMove: elem.modal._opts.onMove,
                onDrop: elem.modal._opts.onDrop
            }).aligner('center');

            // 初始化模态框的遮罩层
            $(elem).dimmer({
                isPage: true,
                // dimmer关闭时,关闭模态框
                onHide: function() {
                    if(multiMode) {
                        for (var id in modals) {
                            if (modals.hasOwnProperty(id) && !modals[id].modal('isHidden')) {
                                modals[id].modal('hide');
                            }
                        }
                    } else {
                        $(elem).modal('hide');
                    }
                }
            });

            // 模态框默认隐藏
            $(elem).css({
                'display': 'none',
                'z-index': $(elem).dimmer('getZIndex') + 1
            });
            // 将模态框存入队列
            modals['#' + $(elem).attr('id')] = $(elem);


            elem.modal._initialized = true;
            elem.modal._isHidden = true;

            if(elem.modal._opts.multiple)
                multiMode = true;
        });
    },
    isHidden: function () {
        var elem = $(this)[0];
        return elem && elem._isHidden;
    },
    show: function () {
        // 显示时的回调
        return $(this).each(function (index, elem) {
            // 如果不支持multiple模式,需要先关闭现存的模态框
            if (!multiMode)
                for (var id in modals) {
                    if (modals.hasOwnProperty(id)
                        && modals[id] !== $(elem)
                        && !modals[id].modal('isHidden')) {
                        modals[id].modal('hide');
                    }
                }
            isFunction(elem.modal._opts.onShow) && elem.modal._opts.onShow();
            if ($(elem).dimmer('dimmed'))
                $(elem).dimmer('show');
            $(elem).css('display', 'block');
            $(elem).css('visibility', 'visible');
            elem.modal._isHidden = false;
            // 显示完成的回调
            isFunction(elem.modal._opts.onShowed) && elem.modal._opts.onShowed();
        });
    },
    hide: function () {
        return $(this).each(function (index, elem) {
            // 隐藏时的回调
            isFunction(elem.modal._opts.onHide) && elem.modal._opts.onHide();
            // 判断隐藏模态框的是来源于dimmer?
            if ($(elem).dimmer('dimmed') && !$(elem).dimmer("isHidden")) {
                if(elem.modal._opts.multiple)
                    $(elem).dimmer('hide');
                else
                    $(elem).dimmer('pureHide');
            }
            $(elem).css('display', 'none');
            $(elem).css('visibility', 'hidden');
            elem.modal._isHidden = true;
            // 隐藏完成的回调
            isFunction(elem.modal._opts.onHidden) && elem.modal._opts.onHidden();
        });
    },
    toggle: function () {
        return $(this).each(function (index, elem) {
            if (elem.modal._isHidden) {
                $(elem).modal('show');
            } else {
                $(elem).modal('hide');
            }
        });
    },
    toLeft: function () {
        return $(this).aligner('toLeft');
    },

    center: function () {
        return $(this).aligner('center');
    },

    toRight: function () {
        return $(this).aligner('toRight');
    },
};

$.fn.modal = function (method) {
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(this, 0));
    } else if (!method || typeof method === 'object') {
        return methods.init.call(this, method);
    } else {
        console.log(method);
        $.error("wrong method");
    }
}

module.exports = global.$ = $;

