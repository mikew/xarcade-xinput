import { PayloadType } from 'redux-async-payload'
import { createReducer } from 'redux-ts-helpers'

import * as actions from './actions'

export interface State {
  currentMapping: string
  mappingNames: string[]
  all: {[mappingName: string]: string}
  currentEditing: string | null
}

const initialState: State = {
  currentMapping: '',
  mappingNames: [],
  all: {},
  currentEditing: null,
}

export const reducer = createReducer(initialState, {
  [`${actions.constants.setCurrent}/start`]: (
    state,
    action: ReturnType<typeof actions.setCurrent>,
  ) => {
    return {
      ...state,
      currentMapping: action.meta,
    }
  },

  [`${actions.constants.refresh}/success`]: (
    state,
    action: ReturnType<typeof actions.refresh>,
  ) => {
    const payload = action.payload as PayloadType<typeof action.payload>

    return {
      ...state,
      currentMapping: payload.currentMapping!,
      all: payload.mappings!,
      mappingNames: Object.keys(payload.mappings!),
    }
  },

  [actions.constants.startEditing]: (
    state,
    action: ReturnType<typeof actions.startEditing>,
  ) => ({
    ...state,
    currentEditing: action.payload,
  }),
})
