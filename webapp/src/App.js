import React, { PureComponent } from 'react'

import Button from 'reactstrap/lib/Button'
import FormGroup from 'reactstrap/lib/FormGroup'
import Label from 'reactstrap/lib/Label'
import Input from 'reactstrap/lib/Input'

class App extends PureComponent {
  mappingInput = null

  state = {
    isControllerRunning: false,
    isKeyboardRunning: false,
  }

  componentDidMount () {
    this.updateStatus()
  }

  render() {
    return (
      <div className="App">
        {/*
        Controllers:
        <br />
        <Button color="danger" onClick={this.stopControllers}>Stop</Button>
        <Button color="success" onClick={this.startControllers}>Start</Button>
        <br /><br />
        Keyboard Mapper:
        <br />
        <Button color="danger" onClick={this.stopKeyboard}>Stop</Button>
        <Button color="success" onClick={this.startKeyboard}>Start</Button>
        <br /><br />
        */}
        All
        <br />
        <Button color="danger" onClick={this.stop}>Stop</Button>
        <Button color="success" onClick={this.start}>Start</Button>
        <br /><br />
        
        <FormGroup>
          <Label for="exampleText">Mapping</Label>
          <Input type="textarea" name="text" id="exampleText" getRef={x => this.mappingInput = x} />
        </FormGroup>
        <Button onClick={this.setMapping} block color="primary">Set Mapping</Button>
      </div>
    )
  }

  stopControllers = () => {
    return fetch('http://localhost:32123/api/controller/stop', { method: 'POST' })
  }

  startControllers = () => {
    return fetch('http://localhost:32123/api/controller/start', { method: 'POST' })
  }

  stopKeyboard = () => {
    return fetch('http://localhost:32123/api/keyboard/stop', { method: 'POST' })
  }

  startKeyboard = () => {
    return fetch('http://localhost:32123/api/keyboard/start', { method: 'POST' })
  }

  stop = () => {
    return this.stopControllers().then(this.stopKeyboard)
  }

  start = () => {
    return this.startControllers().then(this.startKeyboard)
  }

  setMapping = () => {
    console.log(this.mappingInput.value)
    return fetch('http://localhost:32123/api/keyboard/mapping', {
      method: 'POST',
      body: this.mappingInput.value,
    })
  }

  updateStatus = () => {
    return fetch('http://localhost:32123/api/status')
      .then(x => x.json())
      .then(console.log)
  }
}

export default App