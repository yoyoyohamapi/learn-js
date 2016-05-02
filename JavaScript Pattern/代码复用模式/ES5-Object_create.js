var parent = {
    age: 50,
    tags: ['parent']
};

var child = Object.create(parent, {
    age: {
        value: 24
    }
});

console.log(child.age); // 24
console.log(parent.age); // 25
child.tags.push("children");
console.log(parent.tags); // ['parent','children'], ES5提供的方法执行的浅复制



