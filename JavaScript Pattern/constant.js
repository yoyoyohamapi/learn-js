var constant = (function () {
    var constants = {},
        ownProp = Object.prototype.hasOwnProperty,
        allowed = {
            string: 1,
            number: 1,
            boolean: 1
        },
        prefix = (Math.random() + "_").slice(2);

        console.log(prefix);

    return {
        set: function(key, value) {
            if(this.isDefined(key)){
                return false;
            }
            if(!ownProp.call(allowed, typeof value)){
                return false;
            }
            constants[prefix+key] = value;
            return true;
        },
        get: function(key) {
            return this.isDefined(key)?constants[prefix+key]:null;
        },
        isDefined: function(key) {
            return ownProp.call(constants, prefix+key);
        }
    }

})();
