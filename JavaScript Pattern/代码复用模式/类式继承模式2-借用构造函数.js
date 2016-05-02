function Parent(name) {
    this.name = name;
    this.tags = ["parent"];
}

Parent.prototype.say = function () {
    return this.name;
};

function Child(name) {
    Parent.apply(this,arguments);
}

var parent = new Parent("zlq");
var child = new Child("wxj");

console.log(child.name); // wxj
// 该模式可以获得父类的"真实"副本
child.tags.push("child");

// 子类,父类的数组属性为不同引用
console.log(parent.tags); // ['parent']

console.log(parent.tags === child.tags); // false

// 缺点显而易见, 对Parent的原型扩展并未能继承
console.log(child.say()); // "undefined is not a function"