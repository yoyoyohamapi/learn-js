window.onload = function () {
    function Player(name) {
        this.points = 0;
        this.name = name;
    }

    Player.prototype.play = function () {
        this.points = this.points + 1;
        // 通知中介者
        mediator.played();
    };

// 计分板
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

// 中介者: 既控制选手,又控制计分板
    var mediator = {
        players: {},

        setup: function () {
            var players = this.players;
            // 初始化两个参赛者
            players.home = new Player('Home');
            players.guest = new Player('Guest');
        },

        // 如果有选手play,中介器更新计分板
        played: function () {
            var players = this.players,
                score = {
                    Home: players.home.points,
                    Guest: players.guest.points
                };

            scoreboard.update(score);
        },

        // 处理用户交互
        keypress: function (e) {
            e = e || window.event;
            if (e.which === 49) {
                mediator.players.home.play();
                return;
            }
            if (e.which === 48) {
                mediator.players.guest.play();
                return;
            }
        }
    };
    console.log(scoreboard.element);
    // ----------- 测试 ------------
    mediator.setup();
    window.onkeypress = mediator.keypress;

    // 游戏在30秒后结束
    setTimeout(function () {
        window.onkeypress = null;
        alert('Game over!');
    }, 30000);
};
