var parent = {
    name: "Papa"
};


var object = (function () {
    var F = function () {
    };
    return function (obj) {
        F.prototype = obj;
        // F.prototype.name = "Papa";
        return new F();
        // return {__proto__:F.prototype== {name:Papa}}
    }
})();

var child = object(parent);


console.log(child.name); // "Papa"
// child没有那么属性,顺着原型链,在child.__proto__上找到
child.name = "Hihi"; // 修改的自身属性,并不影响原型链上的属性
console.log(parent.name); // "Papa"