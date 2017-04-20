import createReducer from '../redux/createReducer'

import * as actions from './actions'

const initialState = {
  isKeyboardRunning: false,
  isControllerRunning: false,
  hostname: null,
}

export default createReducer (initialState, {
  [`${actions.STATUS_SET_KEYBOARDMAPPER}_START`] (state, action) {
    return {
      ...state,
      isKeyboardRunning: action.payload,
    }
  },

  [`${actions.STATUS_SET_CONTROLLERMANAGER}_START`] (state, action) {
    return {
      ...state,
      isControllerRunning: action.payload,
    }
  },

  [`${actions.STATUS_REFRESH}_SUCCESS`] (state, action) {
    return {
      ...state,
      ...action.payload,
    }
  },
})
