// 糟糕的例子
var add_the_handlers = function (nodes) {
  var i;
  for (i=0; i<nodes.length; i++) {
    nodes[i].onclick = function (e) {
      alert(i);
    }
  }
}

// 修正的例子
var add_the_handlers = function (nodes) {
  var helper = function(i) {
    return function(e) {
      alert(i);
    }
  };

  var i;
  for (i=0; i < nodes.length; i++) {
    nodes[i].onclick = helper(i);
  }
}
