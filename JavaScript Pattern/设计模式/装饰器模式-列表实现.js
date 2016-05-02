// 确切的说,是队列实现
function Sale(price) {
    this.price = (price > 0) || 100;
    // 通过队列, 保存装饰过程
    this.decorators_list = [];
}

Sale.decorators = {};
Sale.decorators.fedtax = {
    // 通过参数传递, 避免继承关系
    getPrice: function (price) {
        return price + price * 5 / 100;
    }
};
Sale.decorators.quebec = {
    getPrice: function (price) {
        return price + price * 7.5 / 100;
    }
};
Sale.decorators.money = {
    getPrice: function (price) {
        return "$" + price.toFixed(2);
    }
};

Sale.prototype.decorate = function (decorator) {
    this.decorators_list.push(decorator);
};

Sale.prototype.getPrice = function () {
    var price = this.price,
        length = this.decorators_list.length,
        name;

    for (var i = 0; i < length; i += 1) {
        // 从队列中依次取出装饰器进行装饰
        name = this.decorators_list[i];
        price = Sale.decorators[name].getPrice(price);
    }
    return price;
};

var sale = new Sale(100);
sale.decorate('fedtax'); // 增加联邦税
sale.decorate('quebec'); // 增加省级税
sale.decorate('money'); // 格式化为美元货币形式
sale.getPrice();