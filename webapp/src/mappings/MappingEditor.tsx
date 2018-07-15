// tslint:disable-next-line:import-name
import AceEditor, { AceEditorProps } from 'react-ace'

import 'brace/mode/json'
import 'brace/theme/tomorrow_night_eighties'

import Button from '@material-ui/core/Button/Button'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogActions from '@material-ui/core/DialogActions/DialogActions'
import DialogContent from '@material-ui/core/DialogContent/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle'
import Icon from '@material-ui/core/Icon/Icon'
import TextField, { TextFieldProps } from '@material-ui/core/TextField/TextField'
import * as React from 'react'

import {
  AppDispatchProps,
  connect,
} from '../commonRedux'

import * as actions from './actions'
import * as selectors from './selectors'

interface ReduxProps {
  editingStartedAt: ReturnType<typeof selectors.editingStartedAt>
  currentEditing: ReturnType<typeof selectors.currentEditing>
  mapping: ReturnType<typeof selectors.currentEditingMapping>
}

interface State {
  isOpen: boolean
  isRenameDialogOpen: boolean
}

class MappingEditor extends React.PureComponent<ReduxProps & AppDispatchProps, State> {
  aceEditor = React.createRef<AceEditor>()
  renameInput = React.createRef<HTMLInputElement>()

  renameInputProps: TextFieldProps['inputProps'] = {
    ref: this.renameInput,
  }

  aceEditorProps: AceEditorProps['editorProps'] = {
    $blockScrolling: true,
  }

  aceEditorSetOptions: AceEditorProps['setOptions'] = {
    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
  }

  state: State = {
    isOpen: false,
    isRenameDialogOpen: false,
  }

  componentDidUpdate (prevProps: ReduxProps) {
    if (prevProps.editingStartedAt !== this.props.editingStartedAt) {
      this.setState({ isOpen: true })
    }
  }

  render () {
    return <Dialog
      fullWidth
      maxWidth="sm"
      open={this.state.isOpen}
      onClose={this.handleClose}
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
          <Button
            href="https://github.com/mikew/xarcade-xinput/blob/master/README.md#mappings"
            target="_blank"
          >
            See instructions here.
          </Button>
        </DialogContentText>
        <AceEditor
          mode="json"
          theme="tomorrow_night_eighties"
          width="100%"
          editorProps={this.aceEditorProps}
          value={this.props.mapping || ''}
          ref={this.aceEditor}
          setOptions={this.aceEditorSetOptions}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={this.openRenameDialog}
        >
          <Icon>content_copy</Icon> Save As New
        </Button>
        <Button
          color="primary"
          variant="raised"
          onClick={this.save}
        >
          <Icon>save</Icon> Save
        </Button>
      </DialogActions>
    </Dialog>
  }

  renderRenameDialog () {
    const defaultName = `${this.props.currentEditing} - ${Math.random().toString(16).substr(2)}`

    return <Dialog
      fullWidth
      open={this.state.isRenameDialogOpen}
    >
      <DialogTitle>
        Enter a new name
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          defaultValue={defaultName}
          inputProps={this.renameInputProps}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleRenameDialogClose}>Cancel</Button>
        <Button
          color="primary"
          variant="raised"
          onClick={this.saveWithRename}
        >
          <Icon>save</Icon> Continue
        </Button>
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
    if (!this.renameInput.current) {
      return
    }

    this._save(this.renameInput.current.value)
  }

  _save = async (name?: string, mapping?: string) => {
    if (!name) {
      // tslint:disable-next-line:no-parameter-reassignment
      name = this.props.currentEditing || undefined
    }

    if (!mapping) {
      // tslint:disable-next-line:no-parameter-reassignment
      mapping = this.aceEditor.current
        ? (this.aceEditor.current as any).editor.getValue()
        : undefined
    }

    if (!name || !mapping) {
      return
    }

    await this.props.dispatch(actions.saveMapping(name, mapping))
    await this.props.dispatch(actions.refresh())
    this.handleRenameDialogClose()
    this.handleClose()
  }
}

export default connect<ReduxProps, {}, AppDispatchProps>((state) => ({
  editingStartedAt: selectors.editingStartedAt(state),
  currentEditing: selectors.currentEditing(state),
  mapping: selectors.currentEditingMapping(state),
}))(MappingEditor)
