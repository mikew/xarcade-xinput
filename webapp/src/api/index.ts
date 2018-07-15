import * as api from './generated/api'

const queryParams = new URLSearchParams(window.location.search)
const urlFromQuery = queryParams.get('API_URL')
const basePath = urlFromQuery
  ? urlFromQuery
  : process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:32123/api'

export default {
  controller: api.ControllerApiFactory(undefined, undefined, basePath),
  keyboard: api.KeyboardApiFactory(undefined, undefined, basePath),
  default: api.DefaultApiFactory(undefined, undefined, basePath),
}
