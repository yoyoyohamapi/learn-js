var HelloMessage = React.createClass({
    render: function() {
        return <div>Hello {this.props.name} </div>
    }
});

// DOM HelloMessage具有属性name,且值为John
// 我们将HelloMessage挂载到mountNode
var mountNode = document.getElementById("container");
ReactDOM.render(<HelloMessage name="John"/>, mountNode);