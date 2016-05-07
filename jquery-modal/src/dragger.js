var $ = require('jquery');


var BASE_OPTIONS = {

    /**
     * 拖拽区域
     */
    region: null,

    /**
     * 组件移动时的回调
     */
    onMove: null,

    /**
     * 拖动完毕时的回调
     */
    onDrop: null,

    /**
     * 开始拖动的回调
     */
    onStart: null

};

function _isFunction(func) {
    return func && typeof func === 'function';
}

var methods = {

    init: function (options) {
        return $(this).each(function(index, elem){
            elem.dragger = {};
            var self = elem;
            elem.dragger._opts = $.extend({}, BASE_OPTIONS, options);
            // 首先需要设置改元素的位置为fixed
            $(elem).css('position', 'fixed');

            // 记录鼠标开始位置
            var mouseStartX, mouseStartY;
            // 记录组件开始位置
            var domStartX, domStartY;

            // 鼠标按下时, 初始化位置
            var $draggerRegion = elem.dragger._opts.region || $(elem);

            $draggerRegion.mousedown(function (e) {
                console.log('down');
                mouseStartX = e.pageX;
                mouseStartY = e.pageY;

                var offset = $(self).offset();

                domStartX = offset.left;
                domStartY = offset.top;

                // 鼠标移动时, DOM需要跟随鼠标移动
                $draggerRegion.on('mousemove',function (e) {
                    // 获得鼠标位置
                    var x = e.pageX,
                        y = e.pageY;

                    // 算出位移状况
                    var newX = domStartX + (x - mouseStartX),
                        newY = domStartY + (y - mouseStartY);

                    // 防止dom尺寸变动,所以动态计算
                    var domWidth = $(self).width(),
                        domHeight = $(self).height();

                    var docWidth = $(document).width(),
                        docHeight = $(document).height();

                    // 执行位移(考虑边界情况)
                    $(self).css({
                        'left': newX <0?0:newX+domWidth>docWidth?docWidth-domWidth:newX,
                        'top': newY <0?0:newY+domHeight>docHeight?docHeight-domHeight:newY
                    });

                    // 执行回调
                    _isFunction(elem.dragger._opts.onMove) && elem.dragger._opts.onMove();
                });

                // 执行回调
                _isFunction(elem.dragger._opts.onStart) && elem.dragger._opts.onStart();
            });



            // 鼠标收起时, 执行完成回调
            $draggerRegion.mouseup(function(){
                $draggerRegion.off('mousemove');
                _isFunction(elem.dragger._opts.onDrop) && elem.dragger._opts.onDrop();
            });
        });
    }

};

$.fn.dragger = function (method) {
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 0));
    } else if (!method || typeof method === 'object') {
        return methods.init.call(this, method);
    } else {
        $.error('plugin dragger does not have ' + method);
    }
}

module.exports = global.$ = $;