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
} from './common'

export default class MappingEntry extends PureComponent {
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
