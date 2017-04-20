import { API_URL } from '../config'

export const MAPPINGS_REFRESH = 'MAPPINGS_REFRESH'
export const MAPPINGS_SAVE = 'MAPPINGS_SAVE'
export const MAPPINGS_DELETE_MAPPING = 'MAPPINGS_DELETE_MAPPING'
export const MAPPINGS_RENAME_MAPPING = 'MAPPINGS_RENAME_MAPPING'
export const MAPPINGS_SET_CURRENT = 'MAPPINGS_SET_CURRENT'
export const MAPPINGS_START_EDITING = 'MAPPINGS_START_EDITING'

export function refresh () {
  return {
    type: MAPPINGS_REFRESH,
    payload: {
      promise: fetch(`${API_URL}/api/keyboard/mapping`).then(x => x.json()),
    },
  }
}

export function saveMapping (name, mapping) {
  return {
    type: MAPPINGS_SAVE,
    payload: {
      promise: fetch(`${API_URL}/api/keyboard/mapping`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          mapping,
        }),
      }),
    },
  }
}

export function setCurrent (name) {
  return {
    type: MAPPINGS_SET_CURRENT,
    payload: {
      promise: fetch(`${API_URL}/api/keyboard/mapping/current`, {
        method: 'POST',
        body: name,
      }),
      data: name,
    },
  }
}

export function startEditing (name) {
  return {
    type: MAPPINGS_START_EDITING,
    payload: name,
  }
}

export function deleteMapping (name) {
  return {
    type: MAPPINGS_DELETE_MAPPING,
    payload: {
      promise: fetch(`${API_URL}/api/keyboard/mapping`, {
        method: 'DELETE',
        body: name,
      }),
      data: name,
    },
  }
}

export function renameMapping (name, newName) {
  return {
    type: MAPPINGS_RENAME_MAPPING,
    payload: {
      promise: fetch(`${API_URL}/api/keyboard/mapping/rename`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          newName,
        }),
      }),
      data: {
        name,
        newName,
      },
    },
  }
}