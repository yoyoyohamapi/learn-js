var memoizer = function (memo, formula) {
  // 定义一个递归
  var recur = function(n) {
    var result = memo[n];
    if (typeof result !== 'number') {
      result = formula(recur, n);
      memo[n] = result;
    }
    return result;
  }
  return recur;
}

var fibonacci = memoizer([0,1], function(recur, n) {
  return recur(n-1) + recur(n-2);
});

fibonacci(10);
