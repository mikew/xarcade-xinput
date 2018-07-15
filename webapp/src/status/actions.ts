import { applyNamespace } from 'redux-ts-helpers'

import api from '../api'
import { AppAsyncAction } from '../commonRedux'

export const constants = applyNamespace('status', {
  setKeyboardMapper: 0,
  setControllerManager: 0,
  refresh: 0,
  setAll: 0,
  restartAll: 0,
})

export const setKeyboardMapper = (shouldEnable: boolean) => {
  const fn = shouldEnable
    ? api.keyboard.keyboardStartPost
    : api.keyboard.keyboardStopPost

  return {
    type: constants.setKeyboardMapper,
    payload: fn(),
    meta: shouldEnable,
  }
}

export const setControllerManager = (shouldEnable: boolean) => {
  const fn = shouldEnable
    ? api.controller.controllerStartPost
    : api.controller.controllerStopPost

  return {
    type: constants.setControllerManager,
    payload: fn(),
    meta: shouldEnable,
  }
}

export const setAll = (shouldEnable: boolean): AppAsyncAction => ({
  type: constants.setAll,
  async payload(dispatch) {
    await dispatch(setKeyboardMapper(shouldEnable))
    await dispatch(setControllerManager(shouldEnable))
  },
  meta: {
    asyncPayload: {
      skipOuter: true,
    },
  },
})

export const restartAll = (): AppAsyncAction => ({
  type: constants.restartAll,
  async payload(dispatch) {
    await dispatch(setAll(false))
    await dispatch(setAll(true))
  },
  meta: {
    asyncPayload: {
      skipOuter: true,
    },
  },
})

export const refresh = () => ({
  type: constants.refresh,
  payload: api.default.statusGet(),
})
