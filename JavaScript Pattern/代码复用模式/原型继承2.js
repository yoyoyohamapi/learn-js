function Person() {
    this.name = "Adam";
}

Person.prototype.getName = function() {
  return this.name;
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

var kid = object(Person.prototype);

console.log(kid.getName()); // undefined
