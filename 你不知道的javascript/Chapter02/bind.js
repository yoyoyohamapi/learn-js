if(!Function.prototype.softBind) {
    Function.prototype.softBind = function(obj) {
        var fn = this;
        var curried = [].slice.call(arguments, 1);
        var bound = function() {
            console.log(this);
            return fn.apply(
                (!this || this === (window||global))?obj:this,
                curried.concat.apply(curried, arguments)
            );
        };
        bound.prototype = Object.create(fn.prototype);
        return bound;
    }
}

function foo() {
    console.log("name" + this.name);
}

var obj = { name: 'obj'},
    obj2 = { name: 'obj2'},
    obj3 = { name: 'obj3'};

var fooOBJ = foo.softBind(obj);
console.log(fooOBJ);
