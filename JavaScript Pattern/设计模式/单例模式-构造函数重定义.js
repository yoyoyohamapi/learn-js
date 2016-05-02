function Universe() {
    var instance = this;

    this.start_time = 0;
    this.bang = "Big";

    // 重写构造函数(Universe被重新定义, 原有的原型扩展及相关属性全部丢失)
    // 当构造时,获得的是第一次定义的实例
    Universe = function () {
        return instance;
    };
}

Universe.prototype.nothing = true;
var uni = new Universe();

// 由于此时的单例始终是第一次调用时获得的实例, 所以新的原型扩展将无效
Universe.prototype.everything = true;
var uni2 = new Universe();

Universe.prototype.nothing; // undefined

uni.nothing; // true
uni2.nothing; // true

uni.everything; // undefined
uni2.everything; // undefined

uni.constructor.name; // "Universe" 重定义的构造与原始构造同名
uni.constructor === Universe; // false, 此时Universe被重写, 而uni来自于未被重写的Universe

