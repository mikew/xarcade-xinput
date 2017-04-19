import React, { PureComponent } from 'react'
import IconButton from 'material-ui/IconButton';
import {
  Menu,
} from 'material-ui/Menu';

export default class IconMenu extends PureComponent {
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
