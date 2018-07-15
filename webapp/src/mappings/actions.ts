import { applyNamespace, createAction } from 'redux-ts-helpers'

import api from '../api'

export const constants = applyNamespace('mappings', {
  refresh: 0,
  saveMapping: 0,
  deleteMapping: 0,
  renameMapping: 0,
  setCurrent: 0,
  startEditing: 0,
})

export const refresh = () => ({
  type: constants.refresh,
  payload: api.keyboard.keyboardMappingGet(),
})

export const saveMapping = (name: string, mapping: string) => ({
  type: constants.saveMapping,
  payload: api.keyboard.keyboardMappingPost({
    name,
    mapping,
  }),
})

export const setCurrent = (name: string) => ({
  type: constants.setCurrent,
  payload: api.keyboard.keyboardMappingCurrentPost(name),
  meta: name,
})

export const startEditing = createAction<string>(constants.startEditing)

export const deleteMapping = (name: string) => ({
  type: constants.deleteMapping,
  payload: api.keyboard.keyboardMappingDelete(name),
  meta: name,
})

export const renameMapping = (name: string, newName: string) => ({
  type: constants.renameMapping,
  payload: api.keyboard.keyboardMappingRenamePost({
    name,
    newName,
  }),
  meta: {
    name,
    newName,
  },
})
