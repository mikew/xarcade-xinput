import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/tomorrow_night_eighties'

import {
  React,
  PureComponent,
  Button,
  Icon,
  List,
  ListSubheader,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  UnmanagedTextField,
  connect,
} from './common'

import MappingEntry from './MappingEntry'

import * as actions from './mappings/actions'

class MappingList extends PureComponent {
  componentDidMount () {
    this.props.refresh()
  }

  render () {
    const children = this.props.mappingNames.map(x => {
      const isActive = x === this.props.currentMapping
      return <MappingEntry name={x} isActive={isActive} key={x} />
    })

    return <List>
      <MappingEditor />
      <ListSubheader>Mappings</ListSubheader>
      {children}
    </List>
  }
}

class MappingEditor extends PureComponent {
  aceEditor = null
  renameInput = null

  state = {
    isOpen: false,
    isRenameDialogOpen: false,
  }

  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.editingStartedAt !== this.props.editingStartedAt) {
      this.setState({ isOpen: true })
    }
  }

  render () {
    return <Dialog
      open={this.state.isOpen}
      onRequestClose={this.handleClose}
      onExited={() => {
        // HACK Reset overflow / padding because material-ui ain't
        setTimeout(() => {
          document.body.style.overflow = ''
          document.body.style.paddingRight = ''
        }, 300)
      }}
    >
      <DialogTitle>
        Edit "{this.props.currentEditing}"
      </DialogTitle>
      <DialogContent>
        {this.renderRenameDialog()}
        <DialogContentText>
          <Button href="https://github.com/mikew/xarcade-xinput#mappings" target="_blank">See instructions here.</Button>
        </DialogContentText>
        <AceEditor
          mode="json"
          theme="tomorrow_night_eighties"
          name="UNIQUE_ID_OF_DIV"
          width="100%"
          editorProps={{ $blockScrolling: true }}
          value={this.props.mapping}
          ref={x => this.aceEditor = x}
        />
      </DialogContent>
      <DialogActions>
        <Button accent onClick={this.openRenameDialog}><Icon>content_copy</Icon> Save As New</Button>
        <Button primary raised onClick={this.save}><Icon>save</Icon> Save</Button>
      </DialogActions>
    </Dialog>
  }

  renderRenameDialog () {
    const defaultName = `${this.props.currentEditing} - ${Math.random().toString(16).substr(2)}`

    return <Dialog
      open={this.state.isRenameDialogOpen}
    >
      <DialogTitle>
        Enter a new name
      </DialogTitle>
      <DialogContent>
        <UnmanagedTextField
          defaultValue={defaultName}
          ref={x => this.renameInput = x}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleRenameDialogClose}>Cancel</Button>
        <Button primary raised onClick={this.saveWithRename}><Icon>save</Icon> Continue</Button>
      </DialogActions>
    </Dialog>
  }

  handleClose = () => {
    this.setState({ isOpen: false })
  }

  handleRenameDialogClose = () => {
    this.setState({ isRenameDialogOpen: false })
  }

  openRenameDialog = () => {
    this.setState({ isRenameDialogOpen: true })
  }

  save = () => {
    this._save()
  }

  saveWithRename = () => {
    this._save(this.renameInput.TextField.props.value)
  }

  _save = (name = this.props.currentEditing, mapping = this.aceEditor.editor.getValue()) => {
    this.props.saveMapping(name, mapping)
      .then(this.props.refresh)
      .then(this.handleRenameDialogClose)
      .then(this.handleClose)
  }
}

MappingEditor = connect(state => ({
  editingStartedAt: state.mappings.editingStartedAt,
  currentEditing: state.mappings.currentEditing,
  mapping: state.mappings.currentEditing && state.mappings.all[state.mappings.currentEditing],
}), actions)(MappingEditor)

export default connect(state => ({
  mappingNames: state.mappings.mappingNames,
  currentMapping: state.mappings.currentMapping,
}), actions)(MappingList)
