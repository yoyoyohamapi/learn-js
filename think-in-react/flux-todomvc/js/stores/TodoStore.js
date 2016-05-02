/*
 * 存储TODO
 */
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {};

/**
 * 创建一个 Todo
 * @param text {string} Todo内容
 */
function create(text) {
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _todos[id] = {
        id: id,
        complete: false,
        text: text
    };
}

/**
 * 更新一个 TODO item
 * @param id {string}
 * @param updates {object} 待更新对象的属性
 */
function update(id, updates) {
    _todos[id] = assign({}, _todos[id], updates);
}

/**
 * 根据一个更新属性值对象更新所有 Todo
 * @param updates {object}
 */
function updateAll(updates) {
    for(var id in _todos) {
        if(_todos.hasOwnProperty(id)) {
            update(id, updates);
        }
    }

}

/**
 * 删除 Todo
 * @param id {string}
 */
function destroy(id) {
    delete _todos[id];
}

/**
 * 删除所有的已完成的 TODO items
 */
function destroyCompleted() {
    for(var id in _todos) {
        if(_todos.hasOwnProperty(id) && _todos[id].complete){
            destroy(id);
        }
    }
}


/*
    通过EventEmitter来实现TodoStore的监听机制
 */
var TodoStore = assign({}, EventEmitter.prototype, {
    /**
     * 是否所有TODO 都已完成
     * @return {boolean}
     */
    areAllComplete: function () {
        for (var id in _todos) {
            if (!_todos[id].complete) {
                return false;
            }
        }
        return true;
    },

    /**
     * 获得所有的TODO
     * @returns {object}
     */
    getAll: function () {
        return _todos;
    },

    /**
     * 发送变更事件
     */
    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    /**
     * 添加变更事件监听
     * @param callback
     */
    addChangeListener: function (callback) {
        // 一旦受到变更事件, 触发回调
        /*
         *   例如, 当我们创建一条todo时,
         *   TodoStore将会发出一条变更事件,
         *   上游的状态维护器TodoApp将会调用callback,
         *   此例中,callback将会重置状态
         */
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * 删除变更事件监听
     * @param callback
     */
    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

/*
   为Store注册回调,
   当Action被派发到TodoStore时, callback被调用
 */
AppDispatcher.register(function callback(action) {
    var text;

    // 根据不同的action类型(即不同的交互逻辑), 执行不同过程
    switch (action.actionType) {
        case TodoConstants.TODO_CREATE:
            text = action.text.trim();
            if( text!=='') {
                create(text);
                // 一旦变更,发出变更事件,
                TodoStore.emitChange();
            }
            break;

        case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
            if(TodoStore.areAllComplete()){
                updateAll({complete: false});
            } else {
                updateAll({complete: true});
            }
            TodoStore.emitChange();
            break;

        case TodoConstants.TODO_UNDO_COMPLETE:
            update(action.id, {complete:false});
            TodoStore.emitChange();
            break;

        case TodoConstants.TODO_COMPLETE:
            update(action.id, {complete: true});
            TodoStore.emitChange();
            break;

        case TodoConstants.TODO_UPDATE_TEXT:
            text = action.text.trim();
            if(text !== '') {
                update(action.id, {text:text});
                TodoStore.emitChange();
            }
            break;

        case TodoConstants.TODO_DESTROY:
            destroy(action.id);
            TodoStore.emitChange();
            break;

        case TodoConstants.TODO_DESTROY_COMPLETED:
            destroyCompleted();
            TodoStore.emitChange();
            break;
        default:
        // no op
    }
});

module.exports = TodoStore;