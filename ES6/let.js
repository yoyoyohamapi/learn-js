var a = [];
for(var i=0;i<10;i++) {
    let c = i;
    a[i] = function() {
        console.log(c);
    };
}

console.log(a);

//for循环中var与let的区别
for(var j=0;j<10;j++) {
 ;
}
console.log(j);
for(let k=0;k<10;k++) {
    ;
}
console.log(k);
console.log(_k);
