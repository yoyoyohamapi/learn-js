/**
 * 组件基类
 * @param width
 * @param height
 * @constructor
 */
function Widget(width, height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
}

// 渲染
Widget.prototype.render = function ($where) {
    if (this.$elem) {
        this.$elem.css({
            width: this.width + "px",
            height: this.height + "px"
        }).appendTo($where);
    }
};

/**
 * 子类--按钮
 * @param width
 * @param height
 * @param label
 * @constructor
 */
function Button(width, height, label) {
    Widget.call(this, width, height);
    this.label = label || "Default";

    this.$elem = $("<button>").text(this.label);
}

// 显式伪多态
Button.prototype.render = function ($where) {
    // 执行基类的渲染方法
    Widget.prototype.render.call(this, $where);
    this.$elem.click(this.onClick.bind(this));
};

Button.prototype.onClick = function (evt) {
    console.log("Button '" + this.label + "' clicked!");
};

$(document).ready(function(){
    var $body = $(document.body);
    var btn1 = new Button(125,30,"Hello");
    var btn2 = new Button(150,40,"World");

    btn1.render($body);
    btn2.render($body);
});