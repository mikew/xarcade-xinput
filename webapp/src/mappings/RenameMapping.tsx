import Button from '@material-ui/core/Button/Button'
import Dialog from '@material-ui/core/Dialog/Dialog'
import DialogActions from '@material-ui/core/DialogActions/DialogActions'
import DialogContent from '@material-ui/core/DialogContent/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle'
import Icon from '@material-ui/core/Icon/Icon'
import TextField, { TextFieldProps } from '@material-ui/core/TextField/TextField'
import * as React from 'react'

export interface RenderProps {
  showDialog: () => any
}

export interface Props {
  mappingName: string | null
  render: (props: RenderProps) => React.ReactChild
  onSave: (newMappingName: string) => any
}

interface State {
  isRenameDialogOpen: boolean
}

export default class RenameMapping extends React.PureComponent<Props, State> {
  renameInput = React.createRef<HTMLInputElement>()

  renameInputProps: TextFieldProps['inputProps'] = {
    ref: this.renameInput,
  }

  state: State = {
    isRenameDialogOpen: false,
  }

  render() {
    const defaultName = `${this.props.mappingName} - ${Math.random().toString(16).substr(2)}`

    return <React.Fragment>
      {this.props.render({
        showDialog: this.showDialog,
      })}

      <Dialog
        fullWidth
        open={this.state.isRenameDialogOpen}
        onClose={this.closeDialog}
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
          <Button onClick={this.closeDialog}>Cancel</Button>
          <Button
            color="primary"
            variant="raised"
            onClick={this.handleSaveClick}
          >
            <Icon>save</Icon> Continue
        </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  }

  showDialog = () => {
    this.setState({ isRenameDialogOpen: true })
  }

  closeDialog = () => {
    this.setState({ isRenameDialogOpen: false })
  }

  handleSaveClick = async () => {
    if (!this.renameInput.current) {
      return
    }

    await this.props.onSave(this.renameInput.current.value)
    this.closeDialog()
  }
}
