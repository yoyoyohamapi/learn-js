(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var TodoList = React.createClass({
    displayName: 'TodoList',

    render: function () {
        var createItem = function (time) {
            return React.createElement(
                'li',
                { key: item.id },
                item.text
            );
        };
        return React.createElement(
            'ul',
            null,
            this.props.items.map(createItem)
        );
    }
});

var TodoApp = React.createClass({
    displayName: 'TodoApp',

    getInitialState: function () {
        // 状态有TODO项, 输入框文本
        return { items: [], text: '' };
    },
    onChange: function (e) {
        this.setState({ text: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault(); // 阻止默认提交行为
        var nextItems = this.state.items.concat([{ text: this.state.text, id: Date.now() }]);
        var nextText = '';
        this.setState({ items: nextItems, text: nextText });
    },
    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'TODO'
            ),
            React.createElement(TodoList, { items: this.state.items }),
            React.createElement(
                'form',
                { onSubmit: this.handleSubmit },
                React.createElement('input', { onChange: this.onChange, value: this.state.text }),
                React.createElement(
                    'button',
                    null,
                    'Add #' + (this.state.items.length + 1)
                )
            )
        );
    }
});

ReactDOM.render(React.createElement(TodoApp, null), mountNode);

},{}]},{},[1]);
