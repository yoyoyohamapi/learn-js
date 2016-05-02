import { combineReducers } from 'redux'
import {
    SELECT_SUBREDDIT, INVALIDATE_SUBREDDIT,
    REQUEST_POSTS, RECEIVE_POSTS
} from '../actions'

/**
 * 该reducer尝试处理子状态: subreddit
 * @param state
 * @param action
 * @returns {*}
 */
function selectedSubreddit(state = 'reactjs', action) {
    switch (action.type) {
        case SELECT_SUBREDDIT:
            return action.subreddit
        default:
            return state
    }
}

/**
 * 处理posts状态
 * @param state
 * @param action
 * @returns {*}
 */
function posts(state = {
    isFetching: false,
    didInvalidate: false,
    items: []
}, action) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        // 请求对应subreddit的posts时, 标识状态
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        // 请求完毕subreddit对应的posts时, 刷新posts列表
        case RECEIVE_POSTS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.posts,
                lastUpdated: action.receivedAt
            })
        default:
            return state
    }
}

/**
 * 该reducer处理子状态: postsBySubreddit
 * @param state
 * @param action
 * @returns {*}
 */
function postsBySubreddit(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_SUBREDDIT:
        case RECEIVE_POSTS:
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                [action.subreddit]: posts(state[action.subreddit], action)
            })
    }
}

const rootReducer = combineReducers({
    // postsBySubreddit[1]: postsBySubreddit[2]
    // 亦即state.postsBySubreddit[1]由reducer: postsBySubreddit[2] 维护
    // 那么, 当dispatch一个action是, postsBySubreddit的参数state为状态树中的postsBySubreddit子状态
    postsBySubreddit,
    selectedSubreddit
})

export default rootReducer
