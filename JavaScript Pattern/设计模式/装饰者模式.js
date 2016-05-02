// 不断装饰基础对象的方法, 那么同样的方法, 获得新的逻辑
function Sale(price) {
    this.price = price || 100;
}

// 原有的getPrice()方法
Sale.prototype.getPrice = function () {
    return this.price;
};

// 装饰器对象,每个装饰器对getPrice()方法进行装饰
Sale.decorators = {};

Sale.decorators.fedtax = {
    getPrice: function () {
        // 继承上一个装饰器的方法
        var price = this.uber.getPrice();
        price = price + price * 5 / 100;
        return price;
    }
};


Sale.decorators.quebec = {
    getPrice: function () {
        var price = this.uber.getPrice();
        price = price + price*7.5/100;
        return price;
    }
};

Sale.decorators.money = {
    getPrice: function () {
        return "$" + this.uber.getPrice().toFixed(2);
    }
};

Sale.decorators.cdn = {
    getPrice: function () {
        return "CDN$" + this.uber.getPrice().toFixed(2);
    }
};

// 装饰方法,需要完成继承,保留上次的装饰结果
Sale.prototype.decorate = function(decorator) {
    var F = function () {},
        overrides = this.constructor.decorators[decorator],
        newobj;

    F.prototype = this;
    newobj = new F();
    newobj.uber = F.prototype;

    for(var prop in overrides) {
        if(overrides.hasOwnProperty(prop)) {
            newobj[prop] = overrides[prop];
        }
    }
    return newobj;
};

var sale = new Sale(100);
sale = sale.decorate('fedtax'); // 增加联邦税
sale = sale.decorate('quebec'); // 增加省级税
sale = sale.decorate('money'); // 格式化为美元货币形式
sale.getPrice();