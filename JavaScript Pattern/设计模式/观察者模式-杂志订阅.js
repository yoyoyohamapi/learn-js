// 发布者
var publisher = {
    // 发布者下注册订阅者
    subscribers: {
        any: [] // 订阅的事件类型: 订阅者列表.any表示订阅所有消息
    },
    /**
     * 订阅某个消息,如果没有显示声明订阅的消息,那么默认订阅所有消息
     * @param fn 订阅者
     * @param type 订阅的消息类型
     */
    subscribe: function (fn, type) {
        type = type || 'any';
        // 如果尚不存在该消息, 添加
        if (typeof this.subscribers[type] === 'undefined') {
            this.subscribers[type] = [];
        }
        // 将订阅者添加到对应事件的订阅列表中
        this.subscribers[type].push(fn);
    },
    /**
     * 取消订阅
     * @param fn
     * @param type
     */
    unsubscribe: function (fn, type) {
        this.visitSubscribes('unsubscribe', fn, type);
    },
    /**
     * 发布消息
     * @param publication 消息体
     * @param type 消息类型, 订阅了该类型的订阅者将收到消息
     */
    publish: function (publication, type) {
        this.visitSubscribes('publish', publication, type);
    },
    visitSubscribes: function (action, arg, type) {
        type = type || 'any';
        var subscribers = this.subscribers[type];
        for (var i = 0, length = subscribers.length; i < length; i++) {
            switch (action) {
                case 'publish':
                    subscribers[i](arg); //fn(arg)
                    break;
                case 'unsubscribe':
                    if (arg === subscribers[i]) {
                        subscribers.slice(i, 1);
                    }
                    break;
                default:
                    return;
            }
        }
    }
};

// 包装对象使之成为publisher
function makePublisher(o) {
    for (var prop in publisher) {
        // 避免复制subscirbers, 造成共享引用
        if (publisher.hasOwnProperty(prop) && typeof publisher[prop] === 'function') {
            o[prop] = publisher[prop];
        }
    }
    o.subscribers = {};
}

var paper = {
    daily: function () {
        this.publish("big new today");
    },
    monthly: function () {
        this.publish("interesting analysis", "monthly");
    }
};

// 使paper成为发布者
makePublisher(paper);

var joe = {
    drinkCoffee: function(paper) {
        console.log('Just read '+ paper);
    },
    sundayPreNap: function(monthly) {
        console.log('About to fail asleep reading this ' + monthly);
    }
};

// joe.drinkCoffee订阅了所有消息
paper.subscribe(joe.drinkCoffee);
// joe.sundayPreNap订阅了'monthly'消息
paper.subscribe(joe.sundayPreNap, 'monthly');

paper.daily();
paper.daily();
paper.daily();
// 发出"interesting analysis"消息体, 其类型为"monthly", 故而joe.sundayPreNap将会被响应
paper.monthly();

// joe同样可以是一个publisher
makePublisher(joe);
joe.tweet = function(msg) {
    this.publish(msg);
};

paper.readTweets = function(tweet) {
    console.log('Call big meeting!Someone '+ tweet);
};

joe.subscribe(paper.readTweets);

joe.tweet(" Curry has won the MVP!");