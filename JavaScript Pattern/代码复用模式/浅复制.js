function extend(parent, child){
    // 当第二个参数为空时,完全复制parent
    child = child || {};
    for (var prop in parent) {
        if(parent.hasOwnProperty(prop)) {
            child[prop] = parent[prop];
        }
    }
    return child;
}

// 这种复制方式在面对{},[]时, parent和child会共享引用
var dad = {
    counts: [1,2,3],
    reads: {paper: true}
};

var kid = extend(dad);
kid.counts.push(4);
console.log(dad.counts); // "[1,2,3,4]"
console.log(dad.reads === kid.reads); // true,共享引用