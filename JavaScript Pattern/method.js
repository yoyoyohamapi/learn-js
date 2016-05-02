if(typeof Function.prototype.method2 !== 'function') {
    Function.prototype.method2 = function(name, fn) {
        this.prototype[name] = fn;
        return this;
    }
}