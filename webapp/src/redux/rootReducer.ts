import { combineReducers } from 'redux'

import * as mappings from '../mappings/reducer'
import * as status from '../status/reducer'

export interface RootStore {
  mappings: mappings.State
  status: status.State,
}

const rootReducer = combineReducers<RootStore>({
  mappings: mappings.reducer,
  status: status.reducer,
})

export default rootReducer
