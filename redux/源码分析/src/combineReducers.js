// 合并各个reducer
import { ActionTypes } from './createStore'
import isPlainObject from 'lodash/isPlainObject'
import warning from './utils/warning'

/**
 * 返回'状态未定义'的错误消息
 * @param key
 * @param action
 * @returns {*}
 */
function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type
  var actionName = actionType && `"${actionType.toString()}"` || 'an action'

  return (
    `Given action ${actionName}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state.`
  )
}

/**
 * 返回'状态格式不被允许'的警告消息
 * @param inputState
 * @param reducers
 * @param action
 * @returns {*}
 */
function getUnexpectedStateShapeWarningMessage(inputState, reducers, action) {
  var reducerKeys = Object.keys(reducers)
  var argumentName = action && action.type === ActionTypes.INIT ?
    'initialState argument passed to createStore' :
    'previous state received by the reducer'

  if (reducerKeys.length === 0) {
    return (
      'Store does not have a valid reducer. Make sure the argument passed ' +
      'to combineReducers is an object whose values are reducers.'
    )
  }

  if (!isPlainObject(inputState)) {
    return (
      `The ${argumentName} has unexpected type of "` +
      ({}).toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
      `". Expected argument to be an object with the following ` +
      `keys: "${reducerKeys.join('", "')}"`
    )
  }

  var unexpectedKeys = Object.keys(inputState).filter(key => !reducers.hasOwnProperty(key))

  if (unexpectedKeys.length > 0) {
    return (
      `Unexpected ${unexpectedKeys.length > 1 ? 'keys' : 'key'} ` +
      `"${unexpectedKeys.join('", "')}" found in ${argumentName}. ` +
      `Expected to find one of the known reducer keys instead: ` +
      `"${reducerKeys.join('", "')}". Unexpected keys will be ignored.`
    )
  }
}

/**
 * 验证reducer合法性
 * 1. 当action类型为'INIT'时, reducer能返回正确的初始化状态而非undefined
 * 2. 当action类型为随机不可知类型是, reducer仍然能够返回非undefined的状态
 * 综上, reducer总要能返回非undefined的初始状态
 * @param reducers
 */
function assertReducerSanity(reducers) {
  Object.keys(reducers).forEach(key => {
    var reducer = reducers[key]
    var initialState = reducer(undefined, { type: ActionTypes.INIT })

    if (typeof initialState === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined during initialization. ` +
        `If the state passed to the reducer is undefined, you must ` +
        `explicitly return the initial state. The initial state may ` +
        `not be undefined.`
      )
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.')
    if (typeof reducer(undefined, { type }) === 'undefined') {
      throw new Error(
        `Reducer "${key}" returned undefined when probed with a random type. ` +
        `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
        `namespace. They are considered private. Instead, you must return the ` +
        `current state for any unknown actions, unless it is undefined, ` +
        `in which case you must return the initial state, regardless of the ` +
        `action type. The initial state may not be undefined.`
      )
    }
  })
}

/**
 * 合并多个reducer函数(这些函数来自于传入的reducers的value)为一个单一reducer函数,
 * 当action被派发, 该reducer下的各个子reducer会被调用,
 * 各自产生的结果将被合并到一个单一的state对象中, 该state对象的key与传入的reducers的key向对应
 *
 * @param {Object} reducers 一个对象,该对象的key指明了reducer维护的状态子集,
 * 该对象的value指明了维护某个状态子集的reducer函数
 *
 * @returns {Function} 一个根reducer, 其下的各个子reducer将会在action到来时被调用
 */
export default function combineReducers(reducers) {
  // 获得reducers的key集合, 这些key表明了要维护的状态名称
  var reducerKeys = Object.keys(reducers)
  var finalReducers = {}
  // 保留真正合法的reducer声明, "key"=>"value(function)"
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i]
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  // 最终有效地key集合, 即切实能维护到的状态名称集合
  var finalReducerKeys = Object.keys(finalReducers)

  // 验证各个reducer的合法性
  var sanityError
  try {
    assertReducerSanity(finalReducers)
  } catch (e) {
    sanityError = e
  }

  /**
   * 最终返回的是一个合并方法
   * @param state {待维护的状态}
   * @param action 一个action
   */
  return function combination(state = {}, action) {
    if (sanityError) {
      throw sanityError
    }

    if (process.env.NODE_ENV !== 'production') {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action)
      if (warningMessage) {
        warning(warningMessage)
      }
    }

    // 一个标识量, 标识某个dispatch是否引起了state的变化
    var hasChanged = false
    var nextState = {}
    // 遍历每一个reducer,
    for (var i = 0; i < finalReducerKeys.length; i++) {
      var key = finalReducerKeys[i]
      var reducer = finalReducers[key]
      // 状态名为key的状态
      var previousStateForKey = state[key]
      // action被dispatch, 经reducer处理后的新状态
      // 注意, 实现reducer只维护一个状态子集的方式就是只传给他对应状态名称的状态
      var nextStateForKey = reducer(previousStateForKey, action)
      // 验证新状态是否合法
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      // 如果新状态不同于老状态, 则标识发生了变化
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    // 如果状态未发生变化,返回老的状态
    return hasChanged ? nextState : state
  }
}
