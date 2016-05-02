"use strict";

var _Math;

// ****函数默认值****
function add() {
    var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    return x + y;
}

add();

// ****rest 参数****
function add2() {
    // of 进行值迭代
    var sum = 0;

    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var val = _step.value;

            sum = sum + val;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return sum;
}

console.log(add2(2, 5, 3));

// ****扩展运算符:自动将数组拆分成参数序列****
Math.max.apply(null, [14, 3, 77]);
(_Math = Math).max.apply(_Math, [14, 3, 77]);
// 等同于
Math.max(14, 3, 77);

// 箭头函数的this绑定
var id = "outerId";
var handler = {
    id: "innerId",
    init: function init() {
        var _this = this;

        // this绑定了定义时所在的对象handler
        setTimeout(function () {
            console.log("handler id is: " + _this.id);
        }, 10);
    }
};

var handler2 = {
    id: "innerId",
    init: function init() {
        setTimeout(function () {
            // this绑定了运行时所在的对象window
            console.log("handler 2 id is: " + this.id);
        }, 20);
    }
};

handler.init();
handler2.init();