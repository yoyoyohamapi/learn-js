function Parent(name) {
    this.name = name || 'Adam';
}

Parent.prototype.say = function() {
    return this.name;
};

function Child(name){}

inherit(Child, Parent);

function inherit(child, parent) {
    child.prototype = parent.prototype;
}

var child = new Child("Curry");
child.say = function() {
    console.log("Curry");
};

var parent = new Parent("Dale");
console.log(parent.say());