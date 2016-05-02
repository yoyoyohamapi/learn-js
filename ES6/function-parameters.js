function test({x,y,z}) {
    console.log("x:"+x);
    console.log("x:"+y);
    console.log("x:"+z);
}

test(1,2,3);
// test({1,2,3}); // 无法通过编译,并不是合法对象
test({x:5,y:6,z:7});