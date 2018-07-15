import Icon from '@material-ui/core/Icon/Icon'
import IconButton from '@material-ui/core/IconButton/IconButton'
import List from '@material-ui/core/List/List'
import ListItem from '@material-ui/core/ListItem/ListItem'
// tslint:disable-next-line:max-line-length
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader'
import Switch from '@material-ui/core/Switch/Switch'
import * as React from 'react'

import {
  AppDispatchProps, connect,
} from '../commonRedux'

import * as actions from './actions'
import * as selectors from './selectors'

interface ReduxProps {
  isKeyboardRunning: ReturnType<typeof selectors.isKeyboardRunning>
  isControllerRunning: ReturnType<typeof selectors.isControllerRunning>
  hostname: ReturnType<typeof selectors.hostname>
}

class Status extends React.PureComponent<ReduxProps & AppDispatchProps> {
  componentDidMount () {
    this.props.dispatch(actions.refresh())
  }

  render () {
    const isRunning = this.props.isKeyboardRunning && this.props.isControllerRunning
    let heading = isRunning
      ? `Running`
      : 'Not Running'

    if (this.props.hostname) {
      heading = `${heading} on ${this.props.hostname}`
    }

    return <List>
      <ListSubheader
        style={{
          backgroundColor: '#fafafa',
          // Parts of a Switch can be z-indexed above this which looks funny.
          zIndex: 1000,
        }}
      >
        Status: {heading}
      </ListSubheader>
      <ListItem>
        <Switch
          checked={isRunning}
          onChange={this.handleEnabledChange}
          // value="checkedB"
          color="primary"
        />
        <ListItemText primary="Enabled" />
        <ListItemSecondaryAction>
          <IconButton onClick={this.handleRestartClick}>
            <Icon>refresh</Icon>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  }

  handleEnabledChange = (event: any, checked: boolean) => {
    this.props.dispatch(actions.setAll(checked))
  }

  handleRestartClick = () => {
    this.props.dispatch(actions.restartAll())
  }
}

export default connect<ReduxProps, {}, AppDispatchProps>((state) => ({
  isKeyboardRunning: selectors.isKeyboardRunning(state),
  isControllerRunning: selectors.isControllerRunning(state),
  hostname: selectors.hostname(state),
}))(Status)
