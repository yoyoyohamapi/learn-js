var Klass = function (Parent, props) {
    var Child;

    // 子类构造函数
    Child = function () {
        // 如果存在父类,且父类拥有构造函数
        if (Child.uber && Child.uber.hasOwnProperty("__construct")) {
            Child.uber.__construct.apply(this, arguments);
        }
        // 如果子类构造函数存在
        if (Child.prototype.hasOwnProperty("__construct")) {
            Child.prototype.__construct.apply(this, arguments);
        }
    };

    // 实现继承(用 "借用构造函数" 方法)
    Parent = Parent || Object;
    var F = function () {
    };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.uber = Parent.prototype;
    Child.prototype.constructor = Child;

    // 初始化子类属性
    for (var prop in props) {
        if (props.hasOwnProperty(prop)) {
            Child.prototype[prop] = props[prop];
        }
    }

    return Child;
};

// -------- 测试 ----------
var Man = Klass(null, {
    __construct: function (what) {
        console.log("Man's constructor");
        this.name = what;
    },
    getName: function () {
        return this.name;
    }
});

var man = new Man("Adam");
console.log(man.getName());

var SuperMan = Klass(Man, {
    __construct: function(what) {
        console.log("SuperMan's constructor");
    },
    getName : function(){
        var name = SuperMan.uber.getName.call(this);
        return "I'am " + name;
    }
});

var superMan = new SuperMan("Curry");
console.log(superMan.getName());