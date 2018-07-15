import * as api from './generated/api'

const queryParams = new URLSearchParams(window.location.search)
const basePath = queryParams.get('API_URL') || undefined

export default {
  controller: api.ControllerApiFactory(undefined, undefined, basePath),
  keyboard: api.KeyboardApiFactory(undefined, undefined, basePath),
  default: api.DefaultApiFactory(undefined, undefined, basePath),
}
