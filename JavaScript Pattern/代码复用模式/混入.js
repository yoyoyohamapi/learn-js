// 混合多个对象为一个对象
function mix() {
    var child = {};
    for (var i = 0, length = arguments.length; i < length; i++) {
        for (var prop in arguments[i]) {
            if(arguments[i].hasOwnProperty(prop)){
                child[prop] = arguments[i][prop];
            }
        }
    }
    return child;
}

var cake = mix(
    {eggs:2, large: true},
    {butter:1, salted: true},
    {flour: "3 cups"},
    {sugar: "sure!"}
);

console.log(cake);