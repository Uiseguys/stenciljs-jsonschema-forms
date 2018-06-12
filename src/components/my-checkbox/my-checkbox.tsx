import {Component, Prop, Event, EventEmitter, Element} from '@stencil/core';

@Component({
    tag: 'my-checkbox',
    shadow: true,
    styleUrl: 'my-checkbox.scss'
})
export class MyCheckbox {
    @Prop() id: string;
    @Prop() for: string;
    @Prop() value: boolean;
    @Prop() cTitle: string;

    @Event() postValue: EventEmitter;
    @Element() element: HTMLElement;

    constructor() {
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.postValue.emit(event.target);
    }

    render() {
        return (
            <div class="form-check">
                <label class="form-check-label">
                    {this.cTitle}<br/>
                    <input
                        id={this.id}
                        type="checkbox"
                        class="form-check-input"
                        onChange={this.handleInputChange}/>
                    <br/><br/>
                </label>
            </div>
        );
    }
}
