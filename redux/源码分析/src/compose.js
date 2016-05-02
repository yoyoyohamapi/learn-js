/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  } else {
    // 获得起始函数
    const last = funcs[funcs.length - 1]
    // 获得其余函数
    const rest = funcs.slice(0, -1)
    // 通过reduce, 不断组合函数
    return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
  }
}
