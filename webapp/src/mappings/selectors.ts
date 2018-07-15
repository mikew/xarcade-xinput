import { createSelector } from 'reselect'

import { RootStore } from '../redux/rootReducer'

export const mappingNames = (state: RootStore) => state.mappings.mappingNames
export const currentMapping = (state: RootStore) => state.mappings.currentMapping

export const editingStartedAt = (state: RootStore) => state.mappings.editingStartedAt
export const currentEditing = (state: RootStore) => state.mappings.currentEditing
export const all = (state: RootStore) => state.mappings.all
export const currentEditingMapping = createSelector(
  [currentEditing, all],
  (_currentEditing, _all) => _currentEditing && _all[_currentEditing],
)
