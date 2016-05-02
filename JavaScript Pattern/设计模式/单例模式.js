function Universe()  {
    // 如果已经存在实例,则返回
    if(typeof Universe.instance === "object") {
        return Universe.instance;
    }

    this.start_time = 0;
    this.bang = "Big";

    Universe.instance = this;

    return this;
}

// -------测试--------
var uni = new Universe();
var uni2 = new Universe();
uni === uni2; // true

// 但是Universe.instance是公开的, 容易被篡改(都赖js没有private)
Universe.instance = undefined;