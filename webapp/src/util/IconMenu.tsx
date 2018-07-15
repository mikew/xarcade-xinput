import Icon from '@material-ui/core/Icon/Icon'
import IconButton from '@material-ui/core/IconButton/IconButton'
import Menu from '@material-ui/core/Menu/Menu'
import * as React from 'react'

interface Props {
  icon: string
}

interface State {
  menuAnchor: HTMLElement | null
  isMenuOpen: boolean
}

export default class IconMenu extends React.PureComponent<Props, State> {
  state: State = {
    menuAnchor: null,
    isMenuOpen: false,
  }

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
      ...props
    } = this.props

    return <div>
      <IconButton onClick={this.openMenu}>
        <Icon>{icon}</Icon>
      </IconButton>
      <Menu
        open={this.state.isMenuOpen}
        anchorEl={this.state.menuAnchor || undefined}
        onClose={this.closeMenu}
        {...props}
      >
        {children}
      </Menu>
    </div>
  }

  openMenu = (event: React.MouseEvent<HTMLElement>) => {
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
