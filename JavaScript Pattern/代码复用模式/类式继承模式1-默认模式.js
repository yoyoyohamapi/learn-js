function Parent(name) {
    this.name = name || 'Adam';
    this.onlyBelongParent = "child should not extend";
}

Parent.prototype.say = function () {
    return this.name;
};

function Child(name) {
    this.name = name;
}

function inherit(Child, Parent) {
    Child.prototype = new Parent();
    /*
     Child.prototype = new Parent() == {
     __proto__: Parent.prototype,
     name: Adam,
     onlyBelongParent: "child should not extend"
     }
     **/
}

// 测试
inherit(Child, Parent);

var child = new Child("wxj");

// new的过程
/*
 *
 * var child = new Child();
 * var child = {}; // 创建空对象
 * child.__proto__ = Child.prototype == new Parent(); // 链接原型链
 * Child.call(child); // 调用构造函数初始化对象
 *
 *
 * */

console.log(child.say()); //wxj

// 顺着原型链找寻say方法
// child.__proto__ === Child.prototype 没有
// child.__proto__.__proto__ === (new Parent()).__proto__ === Parent.prototype 找到

Child.prototype.say = function () {
    return "cover the parent";
};

console.log(child.say());

// 使用该模式的缺点:
// 1. 父类的任何属性都会被继承
// 2. 构造函数中被未能调用父类构造函数
console.log(child.onlyBelongParent);