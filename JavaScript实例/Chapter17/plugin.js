/**
    jQuery插件撰写示例
 */

// 如果想要完成链式调用,将要扩展的方法加入jQuery.fn属性
jQuery.fn.increaseWidth = function() {
    console.log(this);
    return this.each(function() {
        var width = $(this).width() + 10;
        $(this).width(width);
    });
};

// 为了避免与其他库的$符号冲突
;(function($){
    $.fn.flashBlueRed = function() {
        return this.each(function() {
            var hex = rgb2hex($(this).css("background-color"));
            if (hex == "#0000ff") {
                $(this).css("background-color", "#ff0000");
            } else {
                $(this).css("background-color", "#0000ff");
            }
        });
    }
})(jQuery); // 初始化该方法的$符号为jQuery
