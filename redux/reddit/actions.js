import fetch from 'isomorphic-fetch'

export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

/**
 * 产生action: 选中subreddit
 * 该action携带的信息:
 *  1. subreddit
 * @param subredit
 */
export function selectSubreddit(subredit) {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    }
}

/**
 * 产生action: 使subreddit失效
 * 该action携带的信息:
 *  1. subreddit
 * @param subreddit
 * @returns {{type: string, subreddit: *}}
 */
export function invalidateSubreddit(subreddit) {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit
    }
}

/**
 * 产生action: 请求posts
 * 该action携带信息:
 *  1. subreddit
 * @param subreddit
 * @returns {{type: string, subreddit: *}}
 */
export function requestPosts(subreddit) {
    return {
        type: REQUEST_POSTS,
        subreddit
    }
}

/**
 * 产生action: 接受posts
 * 该action携带消息:
 *  1. subreddit
 *  2. posts
 *  3. receivedAt
 * @param subreddit
 * @param json
 * @returns {{type: string, subreddit: *, posts: *, receivedAt: number}}
 */
export function receivePosts(subreddit, json) {
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}

/**
 * 一个异步action: 请求subreddit的posts
 * @param subreddit
 * @returns {Function}
 */
export function fetchPosts(subreddit) {

    // 返回的是一个function, 即action是一个thunk
    return function (dispatch) {
        // 首先dispatch一个requestPost, 标识subreddit的状态
        dispatch(requestPosts)
        // 返回一个Promise对象,方便下一步使用
        return fetch(`http://www.reddit.com/r/${subreddit}.json`)
            .then(response => response.json())
            .then(json => dispatch(receivePosts(subreddit, json)))
    }
}

/**
 * 一个实用方法用以判断是否需要取得posts,
 * 如果有缓存了, 就不必再发出请求
 * @param state
 * @param subreddit
 * @returns {boolean}
 */
function shouldFetchPosts(state, subreddit) {
    const posts = state.postsBySubreddit[subreddit]
    if(!posts) {
        return true
    } else if (posts.isFetching) {
        return false
    } else {
        return posts.didInvalidate
    }
}

/**
 * 该行为按照需要fetch posts
 * @param subreddit
 * @returns {Function}
 */
export function fetchPostsIfNeeded(subreddit) {
    return (dispatch, getState) => {
        if(shouldFetchPosts(getState(), subreddit)) {
            return dispatch(fetchPosts(subreddit))
        } else {
            // 否则返回一个'兑现'的Promise
            return Promise.resolve()
        }
    }
}