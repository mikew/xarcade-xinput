import { API_URL } from '../config'

export const STATUS_SET_KEYBOARDMAPPER = 'STATUS_SET_KEYBOARDMAPPER'
export const STATUS_SET_CONTROLLERMANAGER = 'STATUS_SET_CONTROLLERMANAGER'
export const STATUS_REFRESH = 'STATUS_REFRESH'

export function setKeyboardmapper (shouldEnable) {
  const endpoint = shouldEnable
    ? `${API_URL}/api/keyboard/start`
    : `${API_URL}/api/keyboard/stop`

  return {
    type: STATUS_SET_KEYBOARDMAPPER,
    payload: {
      promise: fetch(endpoint, { method: 'POST' }),
      data: shouldEnable,
    },
  }
}

export function setControllermanager (shouldEnable) {
  const endpoint = shouldEnable
    ? `${API_URL}/api/controller/start`
    : `${API_URL}/api/controller/stop`

  return {
    type: STATUS_SET_CONTROLLERMANAGER,
    payload: {
      promise: fetch(endpoint, { method: 'POST' }),
      data: shouldEnable,
    },
  }
}

export function restartAll () { return (dispatch, getState) => {
  return dispatch(setKeyboardmapper(false))
    .then(() => dispatch(setControllermanager(false)))
    .then(() => dispatch(setKeyboardmapper(true)))
    .then(() => dispatch(setControllermanager(true)))
} }

export function refresh () {
  return {
    type: STATUS_REFRESH,
    payload: {
      promise: fetch(`${API_URL}/api/status`).then(x => x.json()),
    },
  }
}
