import List from '@material-ui/core/List/List'
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader'
import * as React from 'react'

import {
  AppDispatchProps,
  connect,
} from '../commonRedux'

import MappingEditor from './MappingEditor'
import MappingEntry from './MappingEntry'

import * as actions from './actions'
import * as selectors from './selectors'

interface ReduxProps {
  mappingNames: ReturnType<typeof selectors.mappingNames>
  currentMapping: ReturnType<typeof selectors.currentMapping>
}

class MappingList extends React.PureComponent<ReduxProps & AppDispatchProps> {
  componentDidMount () {
    this.props.dispatch(actions.refresh())
  }

  render () {
    const children = this.props.mappingNames.map((x) => {
      const isActive = x === this.props.currentMapping

      return <MappingEntry name={x} isActive={isActive} key={x} />
    })

    return <List>
      <MappingEditor />
      <ListSubheader style={{ backgroundColor: '#fafafa' }}>Mappings</ListSubheader>
      {children}
    </List>
  }
}

export default connect<ReduxProps, {}, AppDispatchProps>((state) => ({
  mappingNames: selectors.mappingNames(state),
  currentMapping: selectors.currentMapping(state),
}))(MappingList)
