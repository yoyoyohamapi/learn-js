"use strict";

var a = [];

var _loop = function _loop() {
    var c = i;
    a[i] = function () {
        console.log(c);
    };
};

for (var i = 0; i < 10; i++) {
    _loop();
}

console.log(a);

//for循环中var与let的区别
for (var j = 0; j < 10; j++) {
    ;
}
console.log(j);
for (var _k2 = 0; _k2 < 10; _k2++) {
    ;
}
console.log(k);
console.log(_k);