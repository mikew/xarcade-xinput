import Icon from '@material-ui/core/Icon/Icon'
import IconButton from '@material-ui/core/IconButton/IconButton'
import Menu, { MenuProps } from '@material-ui/core/Menu/Menu'
import * as React from 'react'
import { Omit } from 'react-redux'

interface Props extends Omit<MenuProps, 'open' | 'anchorEl' | 'onClose'> {
  icon: string
}

interface State {
  isMenuOpen: boolean
}

export default class IconMenu extends React.PureComponent<Props, State> {
  state: State = {
    isMenuOpen: false,
  }

  button = React.createRef<HTMLButtonElement>()

  _closeTimeout: NodeJS.Timer | null

  componentWillUnmount () {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout)
    }
  }

  render () {
    const {
      icon,
      children,
      // tslint:disable-next-line:trailing-comma
      ...menuProps
    } = this.props

    return <div>
      <IconButton
      buttonRef={this.button}
      onClick={this.openMenu}
      >
        <Icon>{icon}</Icon>
      </IconButton>
      <Menu
        open={this.state.isMenuOpen}
        anchorEl={this.button.current || undefined}
        onClose={this.closeMenu}
        {...menuProps}
      >
        {children}
      </Menu>
    </div>
  }

  openMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({
      isMenuOpen: true,
    })
  }

  closeMenu = () => {
    this._closeTimeout = null
    this.setState({
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
