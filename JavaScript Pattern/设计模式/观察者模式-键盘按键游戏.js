var publisher = {
    subscribers: {
        any: []
    },
    on: function (type, fn, context) {
        type = type || 'any';
        fn = typeof fn === 'function' ? fn : context[fn];

        if(typeof this.subscribers[type] === 'undefined') {
            this.subscribers[type] = [];
        }

        this.subscribers[type].push({fn: fn, context:context || this});

    },
    remove: function (type, fn, context) {
        this.visitSubscribers('unsubscriber', type, fn, context);
    },
    fire: function (type, publication) {
        this.visitSubscribers('publish', type, publication);
    },
    visitSubscribers: function (action, type, arg, context) {
        type = type || 'any';
        var subscribers = subscribers[type];
        for(var i= 0,length=subscribers.length; i< length; i++) {
            switch (action) {
                case 'unsubscriber':
                    if(subscribers[i].fn === arg && subscribers[i].context === context)
                        subscribers[i].slice(i, 1);
                    break;
                case 'publish':
                    subscribers[i].fn.call(subscribers[i].context, arg);
                    break;
                default:
                    break;
            }
        }
    }
};

// 记分牌
var scoreboard = {
    element: document.getElementById('results'),

    update: function (score) {
        var msg = '';
        for (var player in score) {
            if (score.hasOwnProperty(player)) {
                msg = msg + '<p><strong>' + player + '<\/strong>: ';
                msg = msg + score[player];
                msg = msg + '<\/p>';
            }
        }
        this.element.innerHTML = msg;
    }
};

function Player(name, key) {
    this.points = 0;
    this.name = name; // 玩家姓名
    this.key = key; // 玩家对应的按键
    // 发送消息, 此时有新的玩家加入
    this.fire('newplayer', this);
}

Player.prototype.play = function () {
    this.points += 1;
    // 消息类型: play
    // 消息体: 该玩家自身
    this.fire('play', this);
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

var game = {
    // 根据key标识玩家,对应玩家需要按下对应按键
    keys: {},
    addPlayer: function (player) {
        var key = player.key.toString().charCodeAt(0);
        this.keys[key] = player;
    },

    handleKeypress: function(e) {
        e = e || window.event;
        if(game.keys[e.which]) {
            game.keys[e.which].play();
        }
    },

    handlePlay: function(player) {
        var players = this.keys,
            score = {};

        for(var player in players) {
            if(players.hasOwnProperty(player)){
                score[players[player].name] = players[player].points;
            }
        }

        this.fire('scorechange', score);
    }
};

makePublisher(Player.prototype);
makePublisher(game);

// 监听newplayer消息,
Player.prototype.on('newplayer', 'addPlayer', game);
Player.prototype.on("play", "handlePlay", game);


game.on("scorechange", scoreboard.update, scoreboard);
window.onkeypress = game.handleKeypress;

