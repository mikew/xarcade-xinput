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

  componentWillUnmount () {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout)
    }
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
    this._closeTimeout = null
    this.setState({
      menuAnchor: null,
      isMenuOpen: false,
    })
  }

  closeMenuWithDelay = () => {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout)
    }

    this._closeTimeout = setTimeout(this.closeMenu, 200)
  }
}
