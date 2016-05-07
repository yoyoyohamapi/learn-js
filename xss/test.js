!function (a, b) {
    function e(a) {
        return function (b) {
            return Object.prototype.toString.call(b) === "[object " + a + "]"
        }
    }

    function k() {
        return j++
    }

    function q(a) {
        return a.match(n)[0]
    }

    function r(a) {
        for (a = a.replace(o, "/"); a.match(p);)a = a.replace(p, "/");
        return a
    }

    function s(a) {
        var b = a.length - 1, c = a.charAt(b);
        return "#" === c ? a.substring(0, b) : ".js" === a.substring(b - 2) || a.indexOf("?") > 0 || ".css" === a.substring(b - 3) || "/" === c ? a : a + ".js"
    }

    function v(a) {
        var b = d.alias;
        return b && g(b[a]) ? b[a] : a
    }

    function w(a) {
        var c, b = d.paths;
        return b && (c = a.match(t)) && g(b[c[1]]) && (a = b[c[1]] + c[2]), a
    }

    function x(a) {
        var b = d.vars;
        return b && a.indexOf("{") > -1 && (a = a.replace(u, function (a, c) {
            return g(b[c]) ? b[c] : a
        })), a
    }

    function y(a) {
        var e, f, g, b = d.map, c = a;
        if (b)for (e = 0, f = b.length; f > e && (g = b[e], c = i(g) ? g(a) || a : a.replace(g[0], g[1]), c === a); e++);
        return c
    }

    function B(a, b) {
        var c, f, e = a.charAt(0);
        return z.test(a) ? c = a : "." === e ? c = r((b ? q(b) : d.cwd) + a) : "/" === e ? (f = d.cwd.match(A), c = f ? f[0] + a.substring(1) : a) : c = d.base + a, c
    }

    function C(a, b) {
        if (!a)return "";
        a = v(a), a = w(a), a = x(a), a = s(a);
        var c = B(a, b);
        return c = y(c)
    }

    function J(a) {
        return a.hasAttribute ? a.src : a.getAttribute("src", 4)
    }

    function R(a, b, c) {
        var f, d = M.test(a), e = D.createElement(d ? "link" : "script");
        c && (f = i(c) ? c(a) : c, f && (e.charset = f)), S(e, b, d), d ? (e.rel = "stylesheet", e.href = a) : (e.async = !0, e.src = a), O = e, L ? K.insertBefore(e, L) : K.appendChild(e), O = null
    }

    function S(a, b, c) {
        var e = c && (Q || !("onload" in a));
        return e ? (setTimeout(function () {
            T(a, b)
        }, 1), void 0) : (a.onload = a.onerror = a.onreadystatechange = function () {
            N.test(a.readyState) && (a.onload = a.onerror = a.onreadystatechange = null, c || d.debug || K.removeChild(a), a = null, b())
        }, void 0)
    }

    function T(a, b) {
        var d, c = a.sheet;
        if (Q)c && (d = !0); else if (c)try {
            c.cssRules && (d = !0)
        } catch (e) {
            "NS_ERROR_DOM_SECURITY_ERR" === e.name && (d = !0)
        }
        setTimeout(function () {
            d ? b() : T(a, b)
        }, 20)
    }

    function U() {
        var a, b, c;
        if (O)return O;
        if (P && "interactive" === P.readyState)return P;
        for (a = K.getElementsByTagName("script"), b = a.length - 1; b >= 0; b--)if (c = a[b], "interactive" === c.readyState)return P = c
    }

    function X(a) {
        var b = [];
        return a.replace(W, "").replace(V, function (a, c, d) {
            d && b.push(d)
        }), b
    }

    function cb(a, b) {
        this.uri = a, this.dependencies = b || [], this.exports = null, this.status = 0, this._waitings = {}, this._remain = 0
    }

    var c, d, f, g, h, i, j, l, m, n, o, p, t, u, z, A, D, E, F, G, H, I, K, L, M, N, O, P, Q, V, W, Y, Z, $, _, ab, bb, db;
    a.seajs || (c = a.seajs = {version: "2.1.1"}, d = c.data = {}, f = e("Object"), g = e("String"), h = Array.isArray || e("Array"), i = e("Function"), j = 0, l = d.events = {}, c.on = function (a, b) {
        var d = l[a] || (l[a] = []);
        return d.push(b), c
    }, c.off = function (a, b) {
        var e, f;
        if (!a && !b)return l = d.events = {}, c;
        if (e = l[a])if (b)for (f = e.length - 1; f >= 0; f--)e[f] === b && e.splice(f, 1); else delete l[a];
        return c
    }, m = c.emit = function (a, b) {
        var e, d = l[a];
        if (d)for (d = d.slice(); e = d.shift();)e(b);
        return c
    }, n = /[^?#]*\//, o = /\/\.\//g, p = /\/[^/]+\/\.\.\//, t = /^([^/:]+)(\/.+)$/, u = /{([^{]+)}/g, z = /^\/\/.|:\//, A = /^.*?\/\/.*?\//, D = document, E = location, F = q(E.href), G = D.getElementsByTagName("script"), H = D.getElementById("seajsnode") || G[G.length - 1], I = q(J(H) || F), K = D.getElementsByTagName("head")[0] || D.documentElement, L = K.getElementsByTagName("base")[0], M = /\.css(?:\?|$)/i, N = /^(?:loaded|complete|undefined)$/, Q = 1 * navigator.userAgent.replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536, V = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g, W = /\\\\/g, Y = c.cache = {}, $ = {}, _ = {}, ab = {}, bb = cb.STATUS = {
        FETCHING: 1,
        SAVED: 2,
        LOADING: 3,
        LOADED: 4,
        EXECUTING: 5,
        EXECUTED: 6
    }, cb.prototype.resolve = function () {
        var d, e, a = this, b = a.dependencies, c = [];
        for (d = 0, e = b.length; e > d; d++)c[d] = cb.resolve(b[d], a.uri);
        return c
    }, cb.prototype.load = function () {
        var b, c, d, e, f, g, a = this;
        if (!(a.status >= bb.LOADING)) {
            for (a.status = bb.LOADING, b = a.resolve(), m("load", b), c = a._remain = b.length, e = 0; c > e; e++)d = cb.get(b[e]), d.status < bb.LOADED ? d._waitings[a.uri] = (d._waitings[a.uri] || 0) + 1 : a._remain--;
            if (0 === a._remain)return a.onload(), void 0;
            for (f = {}, e = 0; c > e; e++)d = Y[b[e]], d.status < bb.FETCHING ? d.fetch(f) : d.status === bb.SAVED && d.load();
            for (g in f)f.hasOwnProperty(g) && f[g]()
        }
    }, cb.prototype.onload = function () {
        var b, c, d, a = this;
        a.status = bb.LOADED, a.callback && a.callback(), b = a._waitings;
        for (c in b)b.hasOwnProperty(c) && (d = Y[c], d._remain -= b[c], 0 === d._remain && d.onload());
        delete a._waitings, delete a._remain
    }, cb.prototype.fetch = function (a) {
        function g() {
            R(e.requestUri, e.onRequest, e.charset)
        }

        function h() {
            delete $[f], _[f] = !0, Z && (cb.save(c, Z), Z = null);
            var a, b = ab[f];
            for (delete ab[f]; a = b.shift();)a.load()
        }

        var e, f, b = this, c = b.uri;
        return b.status = bb.FETCHING, e = {uri: c}, m("fetch", e), f = e.requestUri || c, !f || _[f] ? (b.load(), void 0) : $[f] ? (ab[f].push(b), void 0) : ($[f] = !0, ab[f] = [b], m("request", e = {
            uri: c,
            requestUri: f,
            onRequest: h,
            charset: d.charset
        }), e.requested || (a ? a[e.requestUri] = g : g()), void 0)
    }, cb.prototype.exec = function () {
        function d(a) {
            return cb.get(d.resolve(a)).exec()
        }

        var c, e, f, a = this;
        return a.status >= bb.EXECUTING ? a.exports : (a.status = bb.EXECUTING, c = a.uri, d.resolve = function (a) {
            return cb.resolve(a, c)
        }, d.async = function (a, b) {
            return cb.use(a, b, c + "_async_" + k()), d
        }, e = a.factory, f = i(e) ? e(d, a.exports = {}, a) : e, f === b && (f = a.exports), null !== f || M.test(c) || m("error", a), delete a.factory, a.exports = f, a.status = bb.EXECUTED, m("exec", a), f)
    }, cb.resolve = function (a, b) {
        var c = {id: a, refUri: b};
        return m("resolve", c), c.uri || C(c.id, b)
    }, c.ownCode = arguments.callee.toString(), c.modules = {}, c.hasDefined = {}, cb.define = function (a, d, e) {
        var g, j, k, f = arguments.length;
        1 === f ? (e = a, a = b) : 2 === f && (e = d, h(a) ? (d = a, a = b) : d = b), !h(d) && i(e) && (g = e.toString(), d = X(g)), j = {
            id: a,
            uri: cb.resolve(a),
            deps: d,
            factory: e
        }, !j.uri && D.attachEvent && (k = U(), k && (j.uri = k.src)), m("define", j), j.uri ? cb.save(j.uri, j) : Z = j, g || (g = e.toString()), c.hasDefined[a] = c.modules[a] = g
    }, cb.save = function (a, b) {
        var c = cb.get(a);
        c.status < bb.SAVED && (c.id = b.id || a, c.dependencies = b.deps || [], c.factory = b.factory, c.status = bb.SAVED)
    }, cb.get = function (a, b) {
        return Y[a] || (Y[a] = new cb(a, b))
    }, cb.use = function (b, c, d) {
        var e = cb.get(d, h(b) ? b : [b]);
        e.callback = function () {
            var f, g, b = [], d = e.resolve();
            for (f = 0, g = d.length; g > f; f++)b[f] = Y[d[f]].exec();
            c && c.apply(a, b), delete e.callback
        }, e.load()
    }, cb.preload = function (a) {
        var b = d.preload, c = b.length;
        c ? cb.use(b, function () {
            b.splice(0, c), cb.preload(a)
        }, d.cwd + "_preload_" + k()) : a()
    }, c.use = function (a, b) {
        return cb.preload(function () {
            cb.use(a, b, d.cwd + "_use_" + k())
        }), c
    }, cb.define.cmd = {}, a.define = cb.define, c.Module = cb, d.fetchedList = _, d.cid = k, c.resolve = C, c.require = function (a) {
        return (Y[cb.resolve(a)] || {}).exports
    }, db = /^(.+?\/)(\?\?)?(seajs\/)+/, d.base = (I.match(db) || ["", I])[1], d.dir = I, d.cwd = F, d.charset = "utf-8", d.preload = function () {
        var a = [], b = E.search.replace(/(seajs-\w+)(&|$)/g, "$1=1$2");
        return b += " " + D.cookie, b.replace(/(seajs-\w+)=1/g, function (b, c) {
            a.push(c)
        }), a
    }(), c.config = function (a) {
        var b, e, g, i;
        for (b in a)if (e = a[b], g = d[b], g && f(g))for (i in e)g[i] = e[i]; else h(g) ? e = g.concat(e) : "base" === b && ("/" === e.slice(-1) || (e += "/"), e = B(e)), d[b] = e;
        return m("config", a), c
    })
}(this);
    