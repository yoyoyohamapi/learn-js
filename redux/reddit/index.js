import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { selectSubreddit, fetchPosts, fetchPostsIfNeeded } from './actions'
import rootReducer from './reducers'

const loggerMiddleware = createLogger()

// createStore()的第二个参数包裹了store的dispatch方法
const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)

// 选择订阅的subreddit: reactjs
store.dispatch(selectSubreddit('reactjs'))
store.dispatch(fetchPostsIfNeeded('react.js')).then(()=>
    console.log(store.getState())
)
