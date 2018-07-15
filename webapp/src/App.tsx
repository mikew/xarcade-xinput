import * as React from 'react'

import MappingList from './mappings/MappingList'
import Status from './status/Status'

export default class App extends React.Component {
  render() {
    return <div className="App">
      <Status />
      <MappingList />
    </div>
  }
}
