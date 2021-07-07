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
import * as React from 'react'

import {
  AppDispatchProps,
  connect,
} from '../commonRedux'

import * as actions from './actions'
import RenameMapping, { Props } from './RenameMapping'
import * as selectors from './selectors'

interface ReduxProps {
  currentEditing: ReturnType<typeof selectors.currentEditing>
  mapping: ReturnType<typeof selectors.currentEditingMapping>
}

class MappingEditor extends React.PureComponent<ReduxProps & AppDispatchProps> {
  aceEditor = React.createRef<AceEditor>()

  aceEditorProps: AceEditorProps['editorProps'] = {
    $blockScrolling: true,
  }

  aceEditorSetOptions: AceEditorProps['setOptions'] = {
    fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
  }

  render () {
    return <Dialog
      fullWidth
      maxWidth="sm"
      open={this.props.currentEditing !== null}
      onClose={this.handleClose}
    >
      <DialogTitle>
        Edit "{this.props.currentEditing}"
      </DialogTitle>
      <DialogContent>
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
          value={this.props.mapping || undefined}
          ref={this.aceEditor}
          setOptions={this.aceEditorSetOptions}
        />
      </DialogContent>
      <DialogActions>
        <RenameMapping
          mappingName={this.props.currentEditing}
          onSave={this.handleRename}
          render={this.renderRenameButton}
        />
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

  renderRenameButton: Props['render'] = (props) => {
    return <Button
      color="secondary"
      onClick={props.showDialog}
    >
      <Icon>content_copy</Icon> Save As New
    </Button>
  }

  handleRename: Props['onSave'] = (newName) => {
    this._save(newName)
  }

  handleClose = () => {
    this.props.dispatch(actions.startEditing(null))
  }

  save = () => {
    this._save()
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
    this.handleClose()
  }
}

export default connect<ReduxProps, {}, AppDispatchProps>((state) => ({
  currentEditing: selectors.currentEditing(state),
  mapping: selectors.currentEditingMapping(state),
}))(MappingEditor)
