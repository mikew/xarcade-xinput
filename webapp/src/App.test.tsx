import * as React from 'react'
import App from './App'
import mountComponent from './test/mountComponent'

it('renders without crashing', () => {
  mountComponent(<App />)
})
