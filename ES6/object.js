// ------------Object.assign()-------------
var target = {
    name: 'wxj'
};

var src1 = {
    age: 16
};

var src2 = {
    school: 'uestc'
};

var srcs = [src1, src2];
Object.assign(target,...srcs);

// -----------增强的对象写法------------------
var birth = "1991-11-21";

var Person = {
    name: '张三',
    birth,
    hello() {
        console.log('我的名字是', this.name);
    }
};

var lastWord = "last word";

var a = {
    "first word": "hello",
    [lastWord]: "world"
};

a[lastWord];

// ----------Symbol-------------------------
var obj = {};
var mySymbol = Symbol();
obj[mySymbol] = 'Hello!';

// ----------Observer-----------------------
var book = {
    name: '围城'
};

function observer(changes) {
    changes.forEach(function(change) {
        console.log('发生变动的属性: ' + change.name);
        console.log('变动前的值: ' + change.oldValue);
        console.log('变动后的值: ' + change.object[change.name]);
        console.log('变动类型: ' + change.type);
    });
}

// 注册监听器
Object.observe(book, observer);

book.name = "活着";