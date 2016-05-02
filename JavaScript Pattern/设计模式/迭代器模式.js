var agg = (function () {
    var index = 0,
        data = [1, 2, 3, 4],
        length = data.length;
    return {
        next: function () {
            if (this.hasNext()) {
                var element = data[index];
                index = index + 1;
                return element
            } else {
                return null;
            }
        },
        hasNext: function () {
            return index < length;
        },
        rewind: function () {
            index = 0;
        },
        current: function () {
            return data[index];
        }
    }
})();

// ---------测试---------
while(agg.hasNext()) {
    console.log(agg.next());
}

agg.rewind();

console.log(agg.current());