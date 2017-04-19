import { combineReducers } from 'redux'

import status from '../status/reducer'
import mappings from '../mappings/reducer'

const rootReducer = combineReducers({
  status,
  mappings,
})

export default rootReducer
