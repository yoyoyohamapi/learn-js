function Controller() {
    this.errors = [];
}

Controller.prototype.showDialog = function (title, msg) {
    // 给用户显式标题和信息
};

Controller.prototype.success = function (msg) {
    this.showDialog("Success", msg);
};

Controller.prototype.failure = function (err) {
    this.errors.push(err);
    this.showDialog("Error", err);
};

function LoginController() {
    Controller.call(this);
}

LoginController.prototype = Object.create(Controller.prototype);

LoginController.prototype.getUser = function () {
    return document.getElementById("login_username").value;
};

LoginController.prototype.getPassword = function () {
    return document.getElementById("login_password").value;
};

LoginController.prototype.validateEntry = function (user, pw) {
    user = user || this.getUser();
    pw = pw || this.getPassword();

    if (!(user && pw)) {
        return this.failure("Please enter a username & password");
    }
    else if (user.length < 5) {
        return this.failure("Password must be 5+ characters");
    }

    return true;
};

LoginController.prototype.failure = function (err) {
    Controller.prototype.failure.call(this, "Login invalid: " + err);
};

function AuthController(login) {
    Controller.call(this);
    this.login = login;
}

AuthController.prototype = Object.create(Controller.prototype);

AuthController.prototype.server = function (url, data) {
    return $.ajax({
        url: url,
        data: data
    });
};

AuthController.prototype.checkAuth = function () {
    var user = this.login.getUser();
    var pw = this.login.getPassword();

    if (this.login.validateEntry(user, pw)) {
        this.server("/check-auth", {
                user: user,
                pw: pw
            })
            .then(this.success.bind(this))
            .fail(this.failure.bind(this));
    }
};

AuthController.prototype.success = function () {
    Controller.prototype.success.call(this, "Authenticated!");
};

AuthController.prototype.failure = function (err) {
    Controller.prototype.failure.call(this, "Auth failed" + err);
};

var auth = new AuthController();
auth.checkAuth(new LoginController());
