import React, { PureComponent } from 'react'
import TextField from 'material-ui/TextField'

export default class UnmanagedTextField extends PureComponent {
  static defaultProps = {
    onChange () {},
  }

  state = {
    value: null,
  }

  /*
  componentDidMount () {
    this.setState({ value: this.props.defaultValue || '' })
  }
  */

  /*
  componentWillReceiveProps (nextProps) {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: null })
    }
  }
  */

  render () {
    const {
      defaultValue,
      ...props,
    } = this.props

    const value = this.state.value !== null
      ? this.state.value
      : defaultValue

    return <TextField
      {...props}
      value={value}
      onChange={this.handleChange}
    />
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value || '' })
    this.props.onChange(event)
  }
}
