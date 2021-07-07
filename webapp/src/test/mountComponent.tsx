import { mount, MountRendererProps } from 'enzyme'
import * as React from 'react'
import { Provider } from 'react-redux'
import { Store } from 'redux'

import createStore from '../redux/createStore'
import { RootStore } from '../redux/rootReducer'

export interface MountComponentOptions extends MountRendererProps {
  store?: Store<RootStore>
}

export default function mountComponent<P = {}>(
  element: React.ReactElement<P>,
  options: MountComponentOptions = {},
) {
  const store = options.store || createStore()

  const wrapper = mount(
    <Provider store={store}>
      {element}
    </Provider>,
    options,
  )

  return {
    element,
    store,
    wrapper,
  }
}
