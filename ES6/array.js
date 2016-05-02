Array.of(3,11,8);

[1,5,10,15].find(function(value, index, arr){
    return value>9;
});

[1,5,10,15].find((value,index,array)=>(value>9));

var a1 = [1,2,3,4];

// var a2 = [for (i of a1) i*2]; //数组的 comprehension 被取消

// 通过from及Set数据结构,实现数组去重
function dedupe(array) {
    return Array.from(new Set(array));
}

console.log(dedupe([1,2,2,3,4,4,5]));