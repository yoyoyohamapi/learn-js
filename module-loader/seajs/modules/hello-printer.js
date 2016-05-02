define(function (require, exports, module) {
    console.log("Requiring module: 'hello-printer'");

    module.exports = {
        print: function () {
            var basePrinter = require('base-printer');
            basePrinter.printBase();
            console.log("Hello");
        }
    }

});