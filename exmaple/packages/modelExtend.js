const check = (origin, cache, count) => {
  if (process.env.NODE_ENV !== 'production') {
    for (let key in origin) {
      if (cache.indexOf(key) === -1) {
        cache.push(key)
      } else {
        count[key] ? count[key]++ : count[key] = 1
      }
    }
  }
}

const log = (model, constitute, count) => {
  if (process.env.NODE_ENV !== 'production') {
    let logCount = 0
    for (let key in count) {
      if (!logCount) {
        console.warn(`Please note that some of the attributes are inherited in the ${model.namespace} / ${constitute}:`)
      }
      logCount++
      console.warn(`  -> ${key} be overwritten ${count[key]} time(s).`)
    }
  }
}

export default function modelExtend (...models) {
  const base = { state: () => ({}), namespaced:true, actions: {}, mutations: {}, getters: {} }
  const stateCache = []
  const stateCount = {}
  const gettersCache = []
  const gettersCount = {}
  const actionsCache = []
  const actionsCount = {}
  const mutationsCache = []
  const mutationsCount = {}

  const model = models.reduce((acc, extend) => {
    acc.namespaced = extend.namespaced
    if (typeof acc.namespaced !== 'boolean') {
      console.warn(`  -> acc.namespaced : ${acc.namespaced} is not boolean`)
    }

    if (typeof extend.state === 'function' && !Array.isArray(extend.state)) {
      check(extend.state, stateCache, stateCount)
      const accState = acc.state()
      const extendState = extend.state()
      acc.state = () => Object.assign(accState, extendState)
    } else if ('state' in extend) {
      acc.state = extend.state
    }
    check(extend.getters, gettersCache, gettersCount)
    Object.assign(acc.getters, extend.getters)
    check(extend.actions, actionsCache, actionsCount)
    Object.assign(acc.actions, extend.actions)
    check(extend.mutations, mutationsCache, mutationsCount)
    Object.assign(acc.mutations, extend.mutations)
    return acc
  }, base)

  log(model, 'state', stateCount)
  log(model, 'getters', gettersCount)
  log(model, 'actions', actionsCount)
  log(model, 'mutations', mutationsCount)
  return model
}
