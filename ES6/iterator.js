function makeIterator(array) {
    return {
        [Symbol.iterator]() {
            var index = 0;
            return {
                next(){
                    return index < array.length ?
                    {value: array[index++], done: false} :
                    {value: undefined, done: true}
                }
            }
        }
    };
}

var it = makeIterator([1, 2, 3, 4, 5]);
for (let val of it) {
    console.log(val);
}


function idMaker() {
    var index = 0;

    return {
        [Symbol.iterator] () {
            return {
                next: function () {
                    return {value: index++, done: false}
                }
            }
        }
    }
}

it = idMaker();
for (var n of it) {
    if (n > 5)
        break;
    console.log(n);
}
