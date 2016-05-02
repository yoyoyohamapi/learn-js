var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoConstants = require('../constants/TodoConstants');

var TodoActions = {
    /**
     * 创建行为
     * @param text {string}
     */
    create: function (text) {
        // 将创建行为送到Dispatcher, Dispatcher派发这个行为(action对象)到各个Store
        AppDispatcher.dispatch({
            actionType: TodoConstants.TODO_CREATE,
            text: text
        });
    },

    /**
     * 更新行为
     * @param id {string}
     * @param text {string}
     */
    updateText: function (id, text) {
        AppDispatcher.dispatch({
            actionType: TodoConstants.TODO_UPDATE_TEXT,
            id: id,
            text: text
        });
    },

    /**
     * 全部设置为完成
     * @param todo
     */
    toggleComplete: function (todo) {
        var id = todo.id;
        var actionType = todo.complete ?
            TodoConstants.TODO_UNDO_COMPLETE : TodoConstants.TODO_COMPLETE;

        AppDispatcher.dispatch({
            actionType: actionType,
            id: id
        });
    },

    /**
     * 标记所有的Todo为已完成
     */
    toggleCompleteAll: function () {
        AppDispatcher.dispatch({
            actionType: TodoConstants.TODO_TOGGLE_COMPLETE_ALL
        });
    },

    /**
     *
     * @param id
     */
    destroy: function (id) {
        AppDispatcher.dispatch({
            actionType: TodoConstants.TODO_DESTROY,
            id: id
        });
    },

    /**
     * 删除所有已完成的Todo
     */
    destroyCompleted: function() {
        AppDispatcher.dispatch({
            actionType: TodoConstants.TODO_DESTROY_COMPLETED
        });
    }
};

module.exports = TodoActions;