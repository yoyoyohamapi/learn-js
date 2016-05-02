// 函数化面向对象
var mammal = function(spec) {
  var that = {};

  that.get_name = function() {
    return spec.name;
  };

  that.says = function() {
    return spec.saying || '';
  };
  // 通过返回对象来控制对象的构造，
  // 如此，我们屏蔽了一些不想要外人看到的细节
  return that;
}

// 现在，无法通过myMammal.name方式查看名称
var myMammal = mammal({name: 'Herb'});


// 实现继承
var cat = function (spec) {
  spec.saying = spec.saying || 'meow';
  // 新的实例化
  var that = mammal(spec);
  that.purr = function (n) {
    var i, s = '';
    for (i = 0; i<n; i += 1) {
      if (s) {
        s += '-';
      }
      s += 'r';
    }
    return s;
  };
  that.get_name = function () {
    return that.says() + ' ' + spec.name + ' ' + that.says();
  }
  return that;
}

var myCat = cat({name: 'Henrietta'});
