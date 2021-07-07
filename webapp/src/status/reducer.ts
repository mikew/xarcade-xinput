import { PayloadType } from 'redux-async-payload'
import { createReducer } from 'redux-ts-helpers'

import * as actions from './actions'

export interface State {
  isKeyboardRunning: boolean
  isControllerRunning: boolean
  hostname: string | null
}

const initialState: State = {
  isKeyboardRunning: false,
  isControllerRunning: false,
  hostname: null,
}

export const reducer = createReducer(initialState, {
  [`${actions.constants.setKeyboardMapper}/start`]: (
    state,
    action: ReturnType<typeof actions.setKeyboardMapper>,
  ) => {
    return {
      ...state,
      isKeyboardRunning: action.meta,
    }
  },

  [`${actions.constants.setControllerManager}/start`]: (
    state,
    action: ReturnType<typeof actions.setControllerManager>,
  ) => ({
    ...state,
    isControllerRunning: action.meta,
  }),

  [`${actions.constants.refresh}/success`]: (
    state,
    action: ReturnType<typeof actions.refresh>,
  ) => {
    const payload = action.payload as PayloadType<typeof action.payload>

    return {
      ...state,
      ...payload,
    }
  },
})
