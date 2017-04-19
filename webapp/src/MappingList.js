import AceEditor from 'react-ace'
import 'brace/mode/json'
import 'brace/theme/tomorrow_night_eighties'

import {
  React,
  PureComponent,
  TextField,
  Button,
  IconButton,
  List,
  ListSubheader,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from './common'

import MappingEntry from './MappingEntry'
import {
  API_URL,
} from './config'

export default class MappingList extends PureComponent {
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
      <IconButton onClick={this.handleAddClick}>add</IconButton>
      <IconButton>edit</IconButton>
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
