Sandbox.modules = {};

Sandbox.modules.event = function (box) {
    box.getElement = function () {
        console.log("Get Element");
    };
    box.getStyle = function () {
    };
    box.foo = "bar";
};

Sandbox.modules.dom = function (box) {
    box.attachEvent = function () {
    };
    box.detachEvent = function () {
    };
};

Sandbox.modules.ajax = function (box) {
    box.makeRequest = function () {
    };
    box.getResponse = function () {
    };
};

function Sandbox() {
    var args = Array.prototype.slice.call(arguments),
    // 最后一个参数为回调函数
        callback = args.pop(),
    // 如果参数是以字符串形式传入:SandBox('dom','event',function(){})
    // 或者以数组形式传入,此时数组为第一个参数args[0]: ['dom','event']
        modules = (args[0] && typeof args[0] === "string") ? args : args[0];

    // 确保构造函数能够被调用
    if(!(this instanceof  Sandbox)) {
        return new Sandbox(modules, callback);
    }

    // 新建的对象需要添加的属性
    this.a = 1;
    this.b = 2;

    // 如果需要导入全部模块
    if(!modules || modules === '*') {
        modules = [];
        for(i in Sandbox.modules) {
            if(Sandbox.modules.hasOwnProperty(i)) {
                modules.push(i);
            }
        }
    }

    // 初始化模块
    for(var i = 0,length=modules.length;i<length;i++) {
        Sandbox.modules[modules[i]](this);
    }

    callback(this);
}

Sandbox.prototype = {
    name: 'My Application',
    version: '1.0',
    getName: function() {
        return this.name;
    }
};

// 将sandbox放入沙箱运行

var sandbox = sandbox || {};
new Sandbox('dom',function(sandbox) {
    sandbox.getElement();
});

// 沙箱意外,sandbox无效
console.log(sandbox.foo);