(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var MarkdownEditor = React.createClass({
    displayName: "MarkdownEditor",

    getInitialState: function () {
        return { value: 'Type some *markdown* here' };
    },
    handleChange: function () {
        this.setState({ value: this.refs.textarea.value });
    },
    rawMarkup: function () {
        return { __html: marked(this.state.value, { sanitize: true }) };
    },
    render: function () {
        return React.createElement(
            "div",
            { className: "MarkdownEditor" },
            React.createElement(
                "h3",
                null,
                "Input"
            ),
            React.createElement("textarea", {
                onChange: this.handleChange,
                ref: "textarea",
                defaultValue: this.state.value
            }),
            React.createElement(
                "h3",
                null,
                "Output"
            ),
            React.createElement("div", {
                className: "content",
                dangerouslySetInnerHTML: this.rawMarkup()
            })
        );
    }
});

ReactDOM.render(React.createElement(MarkdownEditor, null), document.getElementById("container"));

},{}]},{},[1]);
