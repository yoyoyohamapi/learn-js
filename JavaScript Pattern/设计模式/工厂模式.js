function CarMaker() {
}

CarMaker.prototype.drive = function () {
    return "Vroom, I have " + this.doors + " doors";
};

// 静态工厂方法,核心是根据字符串(消息)进行构造
CarMaker.factory = function (type) {
    var constr = type,
        newcar;

    // 如果某制造方式不存在
    if (typeof CarMaker[constr] !== "function") {
        throw {
            name: "Error",
            message: constr + " doesn't exist"
        };
    }

    // 原型继承,使得每种车型都有drive方法,且仅一次drive
    if (typeof CarMaker[constr].prototype.drive !== "function") {
        CarMaker[constr].prototype = new CarMaker();
    }

    // 创建新的汽车实例
    newcar = new CarMaker[constr]();

    return newcar;
};

CarMaker.Compact = function () {
    this.doors = 4;
};

CarMaker.Convertible = function () {
    this.doors = 2;
};

CarMaker.SUV = function () {
    this.doors = 24;
};

// ---------测试------------
var corolla = CarMaker.factory("Compact");
var solstice = CarMaker.factory("Convertible");
var cherokee = CarMaker.factory("SUV");

corolla.drive();
solstice.drive();
cherokee.drive();