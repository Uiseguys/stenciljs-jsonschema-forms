import {Component, State} from '@stencil/core';

@Component({
  tag: 'linked-interface',
  shadow: false,
})

export class LinkedInterface {
  @State() schema: any;
  @State() form: any;

  componentWillLoad() {
    this.schema = {}
    this.form = {}
  }

  render() {
    return (
      <h1>Hello</h1>
    );
  }
}
