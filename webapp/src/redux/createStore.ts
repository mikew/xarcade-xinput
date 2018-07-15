import {
  AnyAction,
  applyMiddleware,
  createStore as _createStore,
  DeepPartial,
} from 'redux'
import reduxAsyncPayload from 'redux-async-payload'

import { RootStore } from './rootReducer'

const middleware = [
  reduxAsyncPayload(),
]

function getRootReducer() {
  // Importing this strange way is needed for hot loading.
  return require('./rootReducer').default
}

export default function createStore(initialState?: DeepPartial<RootStore>) {
  const store = _createStore<RootStore, AnyAction, {}, {}>(
    getRootReducer(),
    initialState || {},
    applyMiddleware(...middleware),
  )

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      store.replaceReducer(getRootReducer())
    })
  }

  return store
}
