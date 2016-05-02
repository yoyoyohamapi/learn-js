function Parent(name) {
    this.name = name || "Adam";
}

Parent.prototype.say = function(){
  console.log(this.name);
};

function Child(name) {
    Parent.apply(this,arguments);
}

inherit(Child, Parent);
function inherit(Child, Parent) {
    Child.prototype = new Parent(); // Child的原型指向了Parent的对象,通过__proto__,实现了Child到Parent的原型链
    // Child.prototype.parent === new Parent() === { __proto__:Parent.prototype, name: "Adam" }
}

// 该方法即允许调用父类方法, 又继承了父类已经完成的扩展
// 该方法的缺点在于 Parent() 被调用两次,如果Paren()的初始化业务过重, 该方法无疑较为低效
// 同时,可以看到父类的属性被继承了两次

