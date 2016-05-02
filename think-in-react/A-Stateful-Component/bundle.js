(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Timer = React.createClass({
    displayName: "Timer",

    getInitialState: function () {
        return { secondsElapsed: 0 };
    },
    tick: function () {
        this.setState({
            secondsElapsed: this.state.secondsElapsed + 1
        });
    },
    componentDidMount: function () {
        console.log(this);
        this.interval = setInterval(this.tick, 1000);
    },
    componentWillUnmount: function () {
        clearInterval(this.interval);
    },
    render: function () {
        return React.createElement(
            "div",
            null,
            "Seconds Elapsed: ",
            this.state.secondsElapsed
        );
    }
});

ReactDOM.render(React.createElement(Timer, null), document.getElementById("container"));

},{}]},{},[1]);
