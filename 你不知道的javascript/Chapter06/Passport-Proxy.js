var LoginController = {
    errors: [],
    getUser: function () {
        return document.getElementById("login_username").value;
    },
    getPassword: function () {
        return document.getElementById("login_password").value;
    },
    validateEntry: function () {
        var user = user || this.getUser();
        var pw = pw || this.getPassword();

        if (!(user && pw)) {
            return this.failure("Please enter a username & password");
        } else if (user.length < 5) {
            return this.failure("Password must be 5+ characters");
        }

        return true;
    }
    ,
    showDialog: function (title, msg) {
        // 给用户显式标题和提示
    },
    failure: function () {
        this.errors.push(err);
        this.showDialog("Error", "Login invalid: " + err);
    }
};

var AuthController = Object.create(LoginController);

AuthController.errors = [];

AuthController.checkAuth = function () {
    var user = this.getUser();
    var pw = this.getPassword();

    if (this.validateEntry(user, pw)) {
        this.server("/check-auth", {
                user: user,
                pw: pw
            })
            .then(this.accepted.bind(this))
            .failure(this.accepted.bind(this));
    }
};

AuthController.server = function (url, data) {
    $.ajax({
        url: url,
        data: data
    });
};

AuthController.accepted = function () {
    this.showDialog("Success", "Authenticated");
};

AuthController.rejected = function (err) {
    this.failure("Auth Failed:" + err);
};