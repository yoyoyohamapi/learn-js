import compose from './compose'

/**
 * 为Redux store 的dispatch方法创建一个enhancer来应用中间件
 * 中间件一般来说具有如下两个目的:
 * 1. 在dispatch过程中执行一些额外逻辑, 如日志打印等
 * 2. 处理dispatch接收及返回的action对象(默认为plain object), 使之支持注入Promise或thunk等等类型
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * 注意到, 每个中间件将会被给到'dispatch'及'getState'两个store方法, 而不是拿到整个store
 *
 * @param {...Function} middlewares 中间件列表
 * @returns {Function} A store enhancer applying the middleware.
 */
export default function applyMiddleware(...middlewares) {
  // 重构了createStore方法， 保证用户在拿到store对象前，
  // store对象的dispatch已经被中间件序列包装完毕
  return (createStore) => (reducer, initialState, enhancer) => {
    var store = createStore(reducer, initialState, enhancer)
    // 原始的dispatch
    var dispatch = store.dispatch
    var chain = []

    var middlewareAPI = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }

    // 利用curry化, 初始化中间件链
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    // 组合各个中间件至最终的dispatch形态, 最内层的中间件(最后一个执行的中间件)需要最原始的dispatch,
    dispatch = compose(...chain)(store.dispatch)

    // 返回一个通过中间件重构了dispatch的store对象
    return {
      ...store,
      dispatch
    }
  }
}
