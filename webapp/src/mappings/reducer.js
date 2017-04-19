import createReducer from '../redux/createReducer'

import * as actions from './actions'

const initialState = {
  currentMapping: '',
  mappingNames: [],
  all: {},
  currentEditing: null,
  editingStartedAt: null,
}

export default createReducer (initialState, {
  [`${actions.MAPPINGS_SET_CURRENT}_START`] (state, action) {
    return {
      ...state,
      currentMapping: action.payload,
    }
  },

  [`${actions.MAPPINGS_REFRESH}_SUCCESS`] (state, action) {
    return {
      ...state,
      currentMapping: action.payload.currentMapping,
      all: action.payload.mappings,
      mappingNames: Object.keys(action.payload.mappings),
    }
  },

  [actions.MAPPINGS_START_EDITING] (state, action) {
    return {
      ...state,
      currentEditing: action.payload,
      editingStartedAt: new Date(),
    }
  },
})
