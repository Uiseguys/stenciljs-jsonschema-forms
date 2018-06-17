import {Component, Prop, Event, EventEmitter, Element} from '@stencil/core';

@Component({
    tag: 'my-checkbox',
    shadow: false,
    styleUrl: 'my-checkbox.scss'
})
export class MyCheckbox {
    @Prop() id: string;
    @Prop() for: string;
    @Prop() value: boolean;
    @Prop() labelContent: string;
    @Prop() placeholder: string;

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
                <label class="form-check-label">{this.labelContent}</label><br/>
                <input type="checkbox" class="form-check-input" id={this.id} onChange={this.handleInputChange}/>
                <br/><br/>
            </div>
        );
    }
}
