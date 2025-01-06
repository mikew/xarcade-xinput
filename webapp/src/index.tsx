import 'url-search-params-polyfill'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline'

import createStore from './redux/createStore'

import './index.css'

function renderApp() {
  // tslint:disable-next-line:variable-name
  const App = require('./App').default

  ReactDOM.render(
    <Provider store={store}>
      <CssBaseline>
        <App />
      </CssBaseline>
    </Provider>,
    document.getElementById('root'),
  )
}

export const store = createStore()

renderApp()

if (module.hot) {
  module.hot.accept('./App', renderApp)
}
