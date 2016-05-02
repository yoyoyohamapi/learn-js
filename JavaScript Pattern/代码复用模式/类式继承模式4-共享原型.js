function Parent(){}

Parent.prototype.say = function(){
    console.log("Parent");
};

function Child(){}

function inherit(Child,Parent) {
    Child.prototype = Parent.prototype;
    // 此时,Child和Parent将引用同一个原型
}

inherit(Child, Parent);

// 由于Child和Parent共享原型, 即二者的原型引用指向同一地址, 故任何在Child原型完成的操作也会影响到Parent
Child.prototype.say = function() {
  console.log("Child");
};

var parent = new Parent();
parent.say(); // "Child"