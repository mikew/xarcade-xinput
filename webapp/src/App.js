import React, { PureComponent } from 'react'

import Button from 'reactstrap/lib/Button'
import FormGroup from 'reactstrap/lib/FormGroup'
import Label from 'reactstrap/lib/Label'
import Input from 'reactstrap/lib/Input'

const API_URL = ''

class App extends PureComponent {
  state = {
    isControllerRunning: false,
    isKeyboardRunning: false,
  }

  componentDidMount () {
    this.updateStatus()
  }

  render() {
    return <div className="App">
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
      {this.renderStatus()}
      {this.renderMapping()}
    </div>
  }

  renderStatus () {
    const isRunning = this.state.isControllerRunning
      && this.state.isKeyboardRunning

    return <Status
      isRunning={isRunning}
      onClickStop={this.stop}
      onClickStart={this.start}
      onClickRestart={this.restart}
    />
  }

  renderMapping () {
    return <Mapping
      onClickSet={this.setMapping}
    />
  }

  stopControllers = () => {
    return fetch(`${API_URL}/api/controller/stop`, { method: 'POST' })
  }

  startControllers = () => {
    return fetch(`${API_URL}/api/controller/start`, { method: 'POST' })
  }

  stopKeyboard = () => {
    return fetch(`${API_URL}/api/keyboard/stop`, { method: 'POST' })
  }

  startKeyboard = () => {
    return fetch(`${API_URL}/api/keyboard/start`, { method: 'POST' })
  }

  stop = () => {
    return this.stopKeyboard().then(this.stopControllers)
      .then(this.updateStatus)
  }

  start = () => {
    return this.startKeyboard().then(this.startControllers)
      .then(this.updateStatus)
  }

  restart = () => {
    return this.stop().then(this.start).then(this.updateStatus)
  }

  setMapping = (value) => {
    if (value === '') {
      return Promise.resolve()
    }

    return fetch(`${API_URL}/api/keyboard/mapping`, {
      method: 'POST',
      body: value,
    })
      .then(this.updateStatus)
  }

  updateStatus = () => {
    return fetch(`${API_URL}/api/status`)
      .then(x => x.json())
      .then(x => this.setState(x))
  }
}

class Mapping extends PureComponent {
  mappingInput = null

  static defaultProps = {
    onClickSet: function () { },
    mapping: null,
  }

  render () {
    return <div className="Mapping">
      <FormGroup>
        <Label for="exampleText">Mapping</Label>
        <Input type="textarea" className="monospace" id="exampleText" getRef={x => this.mappingInput = x} />
      </FormGroup>
      <Button onClick={this.setMapping} block color="primary">Set Mapping</Button>
    </div>
  }

  setMapping = () => {
    const value = this.mappingInput.value.trim()
    this.props.onClickSet(value)
  }
}

class Status extends PureComponent {
  static defaultProps = {
    isRunning: false,
    onClickStop: function () { },
    onClickStart: function () { },
    onClickRestart: function () { },
  }

  render () {
    const heading = this.props.isRunning
      ? 'Running'
      : 'Not Running'

    const mainButton = this.props.isRunning
      ? <Button color="danger" onClick={this.props.onClickStop}>Stop</Button>
      : <Button color="success" onClick={this.props.onClickStart}>Start</Button>

    return <div className="Status">
      {heading}
      <br />
      {mainButton}
      <Button onClick={this.props.onClickRestart}>Restart</Button>
      <br /><br />
    </div>
  }
}

export default App