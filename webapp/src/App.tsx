import * as React from 'react'

import AsyncComponent from './AsyncComponent'

export default class App extends React.Component {
  render() {
    return <div className="App">
      <AsyncComponent
        loader={() => import('./status/Status')}
      />
      <AsyncComponent
        loader={() => import('./mappings/MappingList')}
      />
    </div>
  }
}
