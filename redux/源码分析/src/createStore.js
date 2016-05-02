import isPlainObject from 'lodash/isPlainObject'
import $$observable from 'symbol-observable'

/**
 * Redux私有的action类型集
 */
export var ActionTypes = {
  INIT: '@@redux/INIT'
}

/**
 * 创建一个store来持有store tree
 * 唯一能够改变store中数据的方式是dispatch一个action(无行为则必无状态变更)
 *
 * @param {Function} reducer 根reducer, 虽然不是复数形式, 但是根reducer可由其他维护状态子集的
 * reducer 合成
 *
 * @param {any} [initialState] 初始状态
 *
 * @param {Function} enhancer store 加强器, 为store赋予额外功能, 如提升中间件支持的'applyMiddleware'
 *
 * @returns {Store} 返回的store对象能够支持读取当前state(getState()), 设置监听(subscribe())
 * 以及派发行为(dispatch())
 */
export default function createStore(reducer, initialState, enhancer) {
  // 有时候我们的第二个参数可能就直接传入一个enhancer, 所以此时,第二个参数不再意味着是初始状态
  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    enhancer = initialState
    initialState = undefined
  }

  // 如果传递了enhancer, 就必须保证enhancer是一个函数
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }
    // 如果enhancer合法,那么创建store的行为就内联到enhancer中完成
    return enhancer(createStore)(reducer, initialState)
  }

  // 同样, reducer也必须是一个函数
  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  // 记录当前在用的reducer
  var currentReducer = reducer

  // 记录当前的state
  var currentState = initialState

  // 当且设置的监听器列表
  var currentListeners = []
  // 注意, 当前监听器列表和下一次(下一次dispatch后作出响应的)监听器列表指向同一列表
  var nextListeners = currentListeners

  // 一个flag, 标识当前是否正在进行dispatch
  var isDispatching = false

  function ensureCanMutateNextListeners() {
    // 如果二者指向同一列表, 为避免新订阅或者取消订阅对当前正在执行的dispatch的影响,
    // 需要快照当前的监听器列表
    if (nextListeners === currentListeners) {
      // 利用数组slice()方法是返回新的数组特性, 返回一份当前监听列表的拷贝
      nextListeners = currentListeners.slice()
    }
  }

  /**
   * 获得当前的状态树
   *
   * @returns {any} 当前的应用的状态树
   */
  function getState() {
    return currentState
  }

  /**
   *
   * 添加一个监听器, 任何时候当一个action被dispatch, 监听器能获得响应, 进而读取最新状态
   *
   * 1. 在每次'dispatch'前, 监听器列表需要被快照, 这是考虑到:
   * 当我们执行监听器列表中的函数是,此时又订阅或者取消订阅了监听器, 我们不应当影响当前正在执行的dispatch
   * (该dispatch在执行前他已经确定了将会被唤起的监听器), 所以我们需要快照一个该dispatch期望的监听器列表
   * 供其唤起. 但也要注意, 下一次的'dispatch'将启用最新的监听器列表.
   *
   * 2. 监听器并不期望能看到所有的状态变化, 因为在监听器被调用之前, 状态已经在嵌套的'dispatch'(例如经历多个中间件)
   * 中变化了多次, 要保证所有在某个'dispatch'执行前就注册了的监听器能够响应到最近一次的状态(该dispatch运行完后的状态)
   *
   * @param {Function} listener 监听器回调, 能够响应每一次dispatch
   * @returns {Function} 取消订阅该监听器
   */
  function subscribe(listener) {
    // 首先要确保监听器是一个回调函数
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }

    // 标识着当前listener的状态监听已经生效
    var isSubscribed = true

    // 先快照一份当前监听器列表, 以便新创建监听器时, 当前运行的dispatch不产生混淆
    ensureCanMutateNextListeners()
    // 此时,next和current不再指向同一引用, 当前dispatch引起的状态变更响应不会被新订阅监听器响应
    nextListeners.push(listener)

    // 返回一个取消订阅函数,
    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      // 再次快照监听器列表, 以便该监听器被取消后, 当前dispatch引起的状态变更仍能被该监听器响应
      ensureCanMutateNextListeners()

      // 取消该监听器的状态监听
      var index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
    }
  }

  /**
   * Dispatch一个action, 这是唯一能够改变状态的方式
   *
   * Dispatch时,action及当前状态(currentState)将会被呈递给reducer, 以期返回下一个状态
   *
   * 基本的dispatch实现只支持一般对象action, 如果想要dispatch一个Promise对象, 一个Observable对象,
   * 或是一个thunk等等, 通需要通过相应的中间件重新包裹createStore方法. 但要注意的是,中间件最终也只是dispatch
   * 了一个plain object action.
  *
   * @param {Object} action 一个预示着变化的plain object, 其必须包含一个type属性,
   * 且不能为'undefined'
   *
   * @returns {Object} 返回当前dispatch的action
   *
   * 注意, 如果我们自定义了一个中间件包裹了dispatch, 他也可能返回别的形式的对象, 如Promise对象
   */
  function dispatch(action) {

    // 需要action是一个纯对象
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }

    // action需要声明类型
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }

    // 检查是否正在dispatch中
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    // 开是dispatch, 倘若dispatch遇到阻碍(exception), 允许再次dispatch
    try {
      isDispatching = true
      // 通过reducer来刷新状态
      currentState = currentReducer(currentState, action)
    } finally {
      // 修复dispatch状态,以便再次发送
      isDispatching = false
    }

    // 获取最新一次(next)的监听列表, 响应该dispatch
    var listeners = currentListeners = nextListeners
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]()
    }

    return action
  }

  /**
   * 替代当前的Reducer
   *
   * 假如我们的应用想要实现动态加载reducer,或者想要为Redux实现热加载(hot loading)机制,
   * 这个方法将产生作用
   *
   * @param {Function} nextReducer 待替换的reducer
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    currentReducer = nextReducer
    // 改变reducer后,需要刷新初始state tree
    dispatch({ type: ActionTypes.INIT })
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/zenparsing/es-observable
   */
  function observable() {
    var outerSubscribe = subscribe
    return {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.')
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        var unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
  }

  // 当store创建完成, 将会dispatch一个类型为 'INIT' 的action
  // reducer在收到该action后,将返回其初始状态
  // 各个reducer返回的初始状态将构成最初的state tree
  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
