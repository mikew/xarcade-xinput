import React, { PureComponent } from 'react'
import TextField from 'material-ui/TextField'

export default class UnmanagedTextField extends PureComponent {
  TextField = null

  static defaultProps = { }

  state = {
    value: null,
  }

  componentDidMount () {
    this.setState({ value: this.props.defaultValue || '' })
  }

  /*
  componentWillReceiveProps (nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue })
    }
  }
  */

  render () {
    const {
      defaultValue,
      ...props,
    } = this.props

    return <TextField
      {...props}
      value={this.state.value || defaultValue || ''}
      onChange={this.handleChange}
      ref={x => this.TextField = x}
    />
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
  }
}
