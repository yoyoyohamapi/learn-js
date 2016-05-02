// ****函数默认值****
function add(x = 0, y = 0) {
    return x + y;
}

add();

// ****rest 参数****
function add2(...values) {
    // of 进行值迭代
    let sum = 0;
    for (var val of values)
        sum = sum + val;
    return sum;
}

console.log(add2(2, 5, 3));

// ****扩展运算符:自动将数组拆分成参数序列****
Math.max.apply(null, [14, 3, 77]);
Math.max(...[14, 3, 77]);
// 等同于
Math.max(14, 3, 77);

// 箭头函数的this绑定
var id = "outerId";
var handler = {
    id: "innerId",
    init() {
        // this绑定了定义时所在的对象handler
        setTimeout(()=> {
            console.log("handler id is: " + this.id)
        }, 10);
    }
};

var handler2 = {
    id: "innerId",
    init() {
        setTimeout(function () {
            // this绑定了运行时所在的对象window
            console.log("handler 2 id is: " + this.id);
        }, 20);
    }
};

handler.init();
handler2.init();