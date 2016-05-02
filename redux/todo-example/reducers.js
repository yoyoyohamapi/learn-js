import { combineReducers } from 'redux'
import {ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters } from './../todo-example/actions'
const {SHOW_ALL} = VisibilityFilters

const initialState = {
    visibilityFilter: VisibilityFilters.SHOW_ALL,
    todos: []
}

/**
 * todo列表的reducer, 用以变更todo列表的状态
 * @param state
 * @param action
 * @returns {*}
 */
function todos(state=[], action) {
    switch(action.type) {
        case ADD_TODO:
            return [
                ...state,
                {
                    text: action.text,
                    completed: false
                }
            ]
        case COMPLETE_TODO:
            return state.map((todo, index) => {
                if(index === action.index) {
                    return Object.assign({}, todo, {
                        completed: true
                    })
                }
                return todo
            })
        default:
            return state
    }
}

/**
 * 访问性过滤的reducer, 用以变更当前的可访问性, 如"显示全部", "显示已完成"
 * @param state
 * @param action
 * @returns {*}
 */
function visibilityFilter(state=SHOW_ALL, action) {
    switch(action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter
        default:
            return state
    }
}

const todoApp = combineReducers({
    visibilityFilter,
    todos
})

export default todoApp

//function todoApp(state = initialState, action) {
//    return {
//        visibilityFilter: visibilityFilter(state.visibilityFilter, action),
//        todos: todos(state.todos, action)
//    }
//}