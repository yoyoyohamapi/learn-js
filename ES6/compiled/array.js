"use strict";

Array.of(3, 11, 8);

[1, 5, 10, 15].find(function (value, index, arr) {
    return value > 9;
});

[1, 5, 10, 15].find(function (value, index, array) {
    return value > 9;
});