function Universe() {
    var instance;

    Universe = function Universe() {
        return instance;
    };

    // 缓存原型
    Universe.prototype = this;

    instance = new Universe();

    // 缓存正确的构造
    instance.constructor = Universe;

    instance.start_time = 0;
    instance.bang = "Big";

    return instance;
}

Universe.prototype.nothing = true;
var uni = new Universe();
Universe.prototype.everything = true;
var uni2 = new Universe();

Universe.prototype.nothing; // "function"

uni.nothing; // true
uni2.nothing; // true

uni.everything; // undefined
uni2.everything; // undefined

uni.constructor.name; // "Universe" 重定义的构造与原始构造同名
uni.constructor === Universe; // false, 此时Universe被重写, 而uni来自于未被重写的Universe