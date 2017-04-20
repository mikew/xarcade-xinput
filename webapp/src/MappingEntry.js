import {
  React,
  PureComponent,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  MenuItem,
  Icon,
  IconMenu,
  connect,
} from './common'

import * as actions from './mappings/actions'

class MappingEntry extends PureComponent {
  menu = null

  render () {
    let icon = null

    if (this.props.isActive) {
      icon = <ListItemIcon>
        <Icon>check_circle</Icon>
      </ListItemIcon>
    }

    return <ListItem divider ref={x => this.menuIcon = x}>
      {icon}
      <ListItemText primary={this.props.name} secondary="Created 3 days ago" />
      <ListItemSecondaryAction>
        <IconMenu icon="more_vert" ref={x => this.menu = x}>
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

  makeActive = () => {
    this.menu.closeMenuWithDelay()

    this.props.setCurrent(this.props.name)
      .then(this.props.refresh)
  }

  startEditing = () => {
    this.menu.closeMenuWithDelay()

    this.props.startEditing(this.props.name)
  }

  requestDelete = () => {
    if (!confirm(`Really delete ${this.props.name}? This cannot be undone.`)) {
      return
    }

    this.menu.closeMenuWithDelay()
    this.props.deleteMapping(this.props.name)
      .then(this.props.refresh)
  }

  startRename = () => {
    const newName = prompt(`New name for ${this.props.name}`, this.props.name)

    if (newName == null) {
      return
    }

    this.menu.closeMenuWithDelay()
    this.props.renameMapping(this.props.name, newName)
      .then(this.props.refresh)
  }
}

export default connect(null, actions)(MappingEntry)
