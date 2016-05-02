// 表单验证时需要对不同规则应用不同的验证策略
// 全局仅需一个验证器
var validator = {
    // 存放不同策略
    types: {},

    // 保存错误消息
    messages: [],

    // 规则配置
    config: {},

    // 验证方法
    validate: function (data) {
        // 清空错误消息
        this.messages = [];
        for (var prop in data) {
             if(data.hasOwnProperty(prop)){
                 var type = this.config[prop];
                 var checker = this.types[type];

                 // 如果不需要验证,跳过
                 if(!type) {
                     continue;
                 }

                 if(!checker) {
                     throw {
                         name: "ValidationError",
                         message: "No handler to validate type " + type
                     };
                 }

                 var isOK = checker.validate(data[prop]);
                 if(!isOK) {
                     var msg = "Invalid value for *" + prop + "*,"+checker.instructions;
                     this.messages.push(msg);
                 }
             }
        }
        return this.hasErrors();
    },

    hasErrors: function() {
        return this.messages.length !== 0;
    }
};

// checkers
validator.types.isNonEmpty = {
    validate: function (value) {
        return value !== '';
    },
    instructions: "the value cannot be empty"
};

// ---------测试------------
var data = {
    first_name: "Super",
    last_name: ""
};

validator.config = {
    first_name: "isNonEmpty",
    last_name: "isNonEmpty"
};

validator.validate(data);
if(validator.hasErrors()) {
    console.log(validator.messages.join("\n"));
}