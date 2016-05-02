var React = require('react');
var ReactPropTypes = React.PropTypes;
var TodoActions = require('../actions/TodoActions');

var Footer = React.createClass({

    propTypes: {
        allTodos: ReactPropTypes.object.isRequired
    },

    render: function () {
        // 所有的Todo
        var allTodos = this.props.allTodos;
        var total = Object.keys(allTodos).length;

        // 如果不存在todo时,不进行渲染
        if (total === 0) {
            return null;
        }

        var completed = 0;

        // 统计已完成的todo
        for (var key in allTodos) {
            if (allTodos[key].complete) {
                completed++;
            }
        }

        var itemsLeft = total - completed;
        // 修复剩余项表达方式
        var itemsLeftPhrase = itemsLeft === 1 ? 'item' : ' items';
        itemsLeftPhrase += ' left ';

        // 如果有已完成的todo, 添加已完成按钮
        var clearCompletedButton;
        if (completed) {
            clearCompletedButton =
                <button
                    id="clear-completed"
                    onClick={this._onClearCompletedClick}
                >
                    Clear completed ({completed})
                </button>
        }

        return (
            <footer id="footer">
              <span id="todo-count">
                  <strong>
                      {itemsLeft}
                  </strong>
                  {itemsLeftPhrase}
                  </span>
                {clearCompletedButton}
            </footer>
        );

    },

    _onClearCompletedClick: function() {
        // Trigger Action
        TodoActions.destroyCompleted();
    }
});

module.exports = Footer;