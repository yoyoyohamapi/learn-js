function Parent(name) {
    this.name = name || "Adam";
}

function Child(name) {
    Parent.apply(this, arguments);
}

function inherit(Child, Parent) {
    var F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    // Child.prototype === { __proto__:Parent.prototype, }
    // F作为子类和父类间的代理,相比较于new Parent(),临时构造函数的工作过程明显更短,
    // 且父类的属性尽在Child构造时被继承一次
    // 暂存真实的父类引用
    Child.uber = Parent.prototype;
    // 相比较于共享原型模式, 此时修改Child原型,也将不再会影响到Parent原型
}

// 由于每次初始化F函数没有必要, 且子类的构造函数指示器需要修复,
// 我们还可以通过闭包进行如下优化
var inheritOpt = (function() {
    var F = function() {};
    return function(Child, Parent) {
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.uber = Parent.prototype;
        Child.prototype.constructor = Child;
    }
})();