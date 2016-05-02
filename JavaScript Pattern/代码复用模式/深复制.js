var extendDeep = (function(){
    var isArray = function() {
        return Object.prototype.toString.call(this) === "[object Array]";
    };

    return function extend(parent, child) {
        child = child || {};

        for(var prop in parent) {
            if(parent.hasOwnProperty(prop)) {
                if (typeof parent[prop] === "object") {
                    child[prop] = isArray.apply(parent[prop])? []:{};
                    // 递归的复制对象或者数组到child[prop]
                    extend(parent[prop],child[prop]);
                } else{
                    child[prop] = parent[prop];
                }
            }
        }
        return child;
    }
})();

var dad = {
    counts: [1,2,3],
    reads: {paper: true}
};


var kid = extendDeep(dad);
kid.counts.push(4);

console.log(dad.counts); // "[1,2,3]"
console.log(dad.reads === kid.reads); // false, kid的reads为dad.reads的副本