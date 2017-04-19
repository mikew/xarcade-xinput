import {
  React,
  PureComponent,
} from './common'

import Status from './Status'
import MappingList from './MappingList'

class App extends PureComponent {
  state = {
    isControllerRunning: false,
    isKeyboardRunning: false,
  }

  render() {
    return <div className="App">
      <Status />
      <MappingList />
    </div>
  }
}

export default App
