import {
  createStore as _createStore,
  applyMiddleware,
} from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import { createLogger } from 'redux-logger'

const middleware = [
  thunk,
  promise({ promiseTypeSuffixes: [ 'START', 'SUCCESS', 'ERROR' ] }),
  createLogger(),
]

const createStoreWithMiddleware = applyMiddleware(...middleware)(_createStore)

function getRootReducer () {
  // eslint-disable-next-line global-require
  return require('./rootReducer').default
}

export default function createStore (initialState) {
  const store = createStoreWithMiddleware(getRootReducer(), initialState)

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(getRootReducer())
    })
  }

  return store
}
