import React, { PureComponent } from 'react'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { LabelSwitch } from 'material-ui/Switch'
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  ListSubheader,
} from 'material-ui/List'

/*
import FormGroup from 'reactstrap/lib/FormGroup'
import Label from 'reactstrap/lib/Label'
import Input from 'reactstrap/lib/Input'
*/

const API_URL = 'http://10.0.1.18:32123'

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

import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/tomorrow_night_eighties'
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from 'material-ui/Dialog'

class Mapping extends PureComponent {
  mappingInput = null

  static defaultProps = {
    onClickSet: function () { },
    mapping: null,
  }

  state = {
    currentMapping: null,
    isEditorDialogOpen: false,
  }

  render () {
    return <List>
      <Dialog
        title="Dialog With Actions"
        open={this.state.isEditorDialogOpen}
        onRequestClose={this.handleClose}
      >
        <DialogTitle>
          Edit The Thing
        </DialogTitle>
        <DialogContent>
          <TextField defaultValue="omg hi" label="Mapping Name" required />
          <AceEditor
            mode="json"
            theme="tomorrow_night_eighties"
            name="UNIQUE_ID_OF_DIV"
            width="100%"
            editorProps={{ $blockScrolling: true }}
            defaultValue={this.state.currentMapping}
          />
          <DialogContentText>
            You are editing the <em>current</em> mapping.
            Save a copy to be able to recall it later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button accent>Save As New</Button>
          <Button primary raised>Save</Button>
        </DialogActions>
      </Dialog>
      <ListSubheader>Mappings</ListSubheader>
      <IconButton onClick={this.handleAddClick}><Icon>add</Icon></IconButton>
      <IconButton><Icon>edit</Icon></IconButton>
      <MappingEntry />
      <MappingEntry />
    </List>
  }

  setMapping = () => {
    const value = this.mappingInput.value.trim()
    this.props.onClickSet(value)
  }

  handleClose = () => {
    this.setState({ isEditorDialogOpen: false })
  }

  handleAddClick = () => {
    fetch(`${API_URL}/api/keyboard/mapping`)
      .then(x => x.json())
      .then(x => this.setState({
        currentMapping: x.mapping,
        isEditorDialogOpen: true,
      }))
  }
}

import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import {
  Menu,
  MenuItem,
} from 'material-ui/Menu';

class IconMenu extends PureComponent {
  state = {
    menuAnchor: null,
    isMenuOpen: false,
  }

  render () {
    const {
      icon,
      children,
      ...props,
    } = this.props

    return <div>
      <IconButton onClick={this.openMenu}>{icon}</IconButton>
      <Menu
        open={this.state.isMenuOpen}
        anchorEl={this.state.menuAnchor}
        onRequestClose={this.closeMenu}
        {...props}
      >
        {children}
      </Menu>
    </div>
  }

  openMenu = (event) => {
    this.setState({
      menuAnchor: event.currentTarget,
      isMenuOpen: true,
    })
  }

  closeMenu = () => {
    this.setState({
      menuAnchor: null,
      isMenuOpen: false,
    })
  }
}

class MappingEntry extends PureComponent {
  render () {
    return <ListItem divider ref={x => this.menuIcon = x}>
      <ListItemText primary="asdff" secondary="Created 3 days ago" />
      <ListItemSecondaryAction>
        <IconMenu icon="more_vert">
          <MenuItem component="div">
            <ListItemIcon>
              <Icon>check_circle</Icon>
            </ListItemIcon>
            Make Active
          </MenuItem>

          <MenuItem component="div">
            <ListItemIcon>
              <Icon>content_copy</Icon>
            </ListItemIcon>
            Copy
          </MenuItem>

          <MenuItem component="div">
            <ListItemIcon>
              <Icon>delete_forever</Icon>
            </ListItemIcon>
            Delete
          </MenuItem>
        </IconMenu>
      </ListItemSecondaryAction>
    </ListItem>
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

    return <div className="Status">
      <ListSubheader>Status: {heading}</ListSubheader>
      <LabelSwitch label="Keyboard" checked={this.props.isRunning} />
      <br />
      <LabelSwitch label="Controllers" checked={this.props.isRunning} />
      <br />
      <Button onClick={this.props.onClickRestart} raised>Restart</Button>
      <br /><br />
    </div>
  }
}

export default App