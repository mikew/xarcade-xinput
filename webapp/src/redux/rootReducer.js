import { combineReducers } from 'redux'

import status from '../status/reducer'

const rootReducer = combineReducers({
  status,
})

export default rootReducer
