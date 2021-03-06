import {Component, Prop, Event, EventEmitter, Element} from '@stencil/core';

@Component({
  tag: 'checkbox-generator',
  shadow: false,
  styleUrl: 'checkbox-generator.scss'
})
export class CheckboxGeneratorComponent {
  @Prop() id: string;
  @Prop() for: string;
  @Prop() value: boolean;
  @Prop() label: string;
  @Prop() placeholder: string;

  @Element() element: HTMLElement;
  @Event() onChange: EventEmitter;

  constructor() {
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    this.onChange.emit(event.target);
  }

  render() {
    return (
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id={this.id} onChange={this.handleInputChange}/>
        <label class="form-check-label">{this.label}</label>
      </div>
    );
  }
}
