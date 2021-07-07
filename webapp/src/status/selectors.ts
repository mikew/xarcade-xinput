import { RootStore } from '../redux/rootReducer'

export const isKeyboardRunning = (state: RootStore) => state.status.isKeyboardRunning
export const isControllerRunning = (state: RootStore) => state.status.isControllerRunning
export const hostname = (state: RootStore) => state.status.hostname
