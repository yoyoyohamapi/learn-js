"use strict";

function makeIterator(array) {
    var index = 0;
    return {
        next: function next() {
            return index < array.length ? { value: array[index++], done: false } : { value: undefined, done: true };
        }
    };
}

var it = makeIterator([1, 2, 3, 4, 5]);
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = it[Symbol.iterator]()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var val = _step.value;

        console.log(val);
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