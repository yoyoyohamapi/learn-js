'use strict';

require('babel-polyfill');

var _marked = [helloWorldGenerator].map(regeneratorRuntime.mark);

function helloWorldGenerator() {
    return regeneratorRuntime.wrap(function helloWorldGenerator$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return 'hello';

                case 2:
                    _context.next = 4;
                    return 'world';

                case 4:
                    return _context.abrupt('return', 'ending');

                case 5:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

var hw = helloWorldGenerator();
hw.next();
hw.next();
hw.next();
hw.next();