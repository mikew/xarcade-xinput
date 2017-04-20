import {
  React,
  PureComponent,
  ListSubheader,
  LabelSwitch,
  Button,
  connect,
} from './common'

import * as actions from './status/actions'

class Status extends PureComponent {
  componentDidMount () {
    this.props.refresh()
  }

  render () {
    const isRunning = this.props.isKeyboardRunning && this.props.isControllerRunning
    let heading = isRunning
      ? `Running`
      : 'Not Running'

    if (this.props.hostname) {
      heading = `${heading} on ${this.props.hostname}`
    }

    return <div className="Status">
      <ListSubheader>Status: {heading}</ListSubheader>
      <LabelSwitch
        label="Keyboard"
        checked={this.props.isKeyboardRunning}
        onChange={(_, shouldEnable) => this.props.setKeyboardmapper(shouldEnable)}
      />
      <br />
      <LabelSwitch
        label="Controllers"
        checked={this.props.isControllerRunning}
        onChange={(_, shouldEnable) => this.props.setControllermanager(shouldEnable)}
      />
      <br />
      <Button onClick={this.props.restartAll} raised>Restart</Button>
      <br /><br />
    </div>
  }
}

export default connect((state) => ({
  ...state.status,
}), actions)(Status)
