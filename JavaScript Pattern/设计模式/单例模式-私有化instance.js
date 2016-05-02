var Universe;

(function () {
    var instance;

    Universe = function Universe() {
        if(instance) {
            return instance;
        }

        instance = this;

        this.start_time = 0;
        this.bang = "Big";
    }
})();