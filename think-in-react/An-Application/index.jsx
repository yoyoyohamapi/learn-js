var TodoList = React.createClass({
    render: function () {
        var createItem = function (time) {
            return <li key={item.id}>{item.text}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
});

var TodoApp = React.createClass({
    getInitialState: function () {
        // 状态有TODO项, 输入框文本
        return {items: [], text: ''};
    },
    onChange: function (e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function (e) {
        e.preventDefault(); // 阻止默认提交行为
        var nextItems = this.state.items.concat(
            [{text: this.state.text, id: Date.now()}]
        );
        var nextText = '';
        this.setState({items: nextItems, text: nextText});
    },
    render: function () {
        return (
            <div>
                <h3>TODO</h3>
                <TodoList items={this.state.items}/>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.onChange} value={this.state.text}/>
                    <button>{'Add #' + (this.state.items.length + 1)}</button>
                </form>
            </div>
        );
    }
});

ReactDOM.render(
    <TodoApp />,
    mountNode
);