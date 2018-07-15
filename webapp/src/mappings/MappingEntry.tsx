import Icon from '@material-ui/core/Icon/Icon'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon'
// tslint:disable-next-line:max-line-length
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import MenuItem from '@material-ui/core/MenuItem/MenuItem'
import * as React from 'react'

import {
  AppDispatchProps,
  connect,
} from '../commonRedux'

import IconMenu from '../util/IconMenu'

import * as actions from './actions'

interface Props {
  isActive: boolean
  name: string
}

class MappingEntry extends React.PureComponent<Props & AppDispatchProps> {
  menu = React.createRef<IconMenu>()

  render () {
    let icon = null

    if (this.props.isActive) {
      icon = <ListItemIcon>
        <Icon>check_circle</Icon>
      </ListItemIcon>
    }

    return <ListItem divider>
      {icon}
      <ListItemText primary={this.props.name} secondary="Created 3 days ago" />
      <ListItemSecondaryAction>
        <IconMenu icon="more_vert" ref={this.menu}>
          <MenuItem component="div" onClick={this.makeActive}>
            <ListItemIcon>
              <Icon>check_circle</Icon>
            </ListItemIcon>
            Make Active
          </MenuItem>

          <MenuItem component="div" onClick={this.startEditing}>
            <ListItemIcon>
              <Icon>edit</Icon>
            </ListItemIcon>
            Edit
          </MenuItem>

          <MenuItem component="div" onClick={this.startRename}>
            <ListItemIcon>
              <Icon>label</Icon>
            </ListItemIcon>
            Rename
          </MenuItem>

          <MenuItem component="div" onClick={this.requestDelete}>
            <ListItemIcon>
              <Icon>delete_forever</Icon>
            </ListItemIcon>
            Delete
          </MenuItem>
        </IconMenu>
      </ListItemSecondaryAction>
    </ListItem>
  }

  makeActive = async () => {
    this.menu.current!.closeMenuWithDelay()

    await this.props.dispatch(actions.setCurrent(this.props.name))

    return this.props.dispatch(actions.refresh())
  }

  startEditing = () => {
    this.menu.current!.closeMenuWithDelay()

    this.props.dispatch(actions.startEditing(this.props.name))
  }

  requestDelete = async () => {
    if (!confirm(`Really delete ${this.props.name}? This cannot be undone.`)) {
      return
    }

    this.menu.current!.closeMenuWithDelay()
    await this.props.dispatch(actions.deleteMapping(this.props.name))

    return this.props.dispatch(actions.refresh())
  }

  startRename = async () => {
    const newName = prompt(`New name for ${this.props.name}`, this.props.name)

    if (newName == null) {
      return
    }

    this.menu.current!.closeMenuWithDelay()
    await this.props.dispatch(actions.renameMapping(this.props.name, newName))

    return this.props.dispatch(actions.refresh())
  }
}

export default connect<{}, {}, AppDispatchProps>()(MappingEntry)
