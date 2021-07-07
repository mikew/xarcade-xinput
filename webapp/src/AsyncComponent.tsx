import * as React from 'react'

interface Props {
  loader: () => Promise<{ default: React.ComponentType<any> }>
}

interface State {
  Component?: React.ComponentType
}

export default class AsyncComponent extends React.PureComponent<Props, State> {
  state: State = {

  }

  async componentDidMount() {
    this.setState({ Component: (await this.props.loader()).default })
  }

  render() {
    const { Component } = this.state

    if (!Component) {
      return null
    }

    return <Component />
  }
}
