import {Component, Prop, State, Event, EventEmitter, Element} from '@stencil/core';

@Component({
    tag: 'dropdown-generator',
    shadow: false,
    styleUrl: 'dropdown-generator.scss'
})
export class DropdownGeneratorComponent {
    @State() currentValue: string;

    @Prop() id: string;
    @Prop() for: string;
    @Prop() value: string;
    @Prop() labelContent: string;
    @Prop() placeholder: string;

    @Event() postValue: EventEmitter;
    @Element()
    element: HTMLElement;

    getSelectValues(event) {
        this.currentValue = event.currentTarget.value;
        this.postValue.emit(this.element);
    };

    render() {
        const parsedValue = this.value ? JSON.parse(this.value) : null;

        return (
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <label class="input-group-text">{this.labelContent}</label>
                </div>
                <select class="custom-select" id={this.id} value={this.currentValue} onClick={(event) => this.getSelectValues(event)}>
                    {parsedValue && parsedValue.map((value) =>
                        <option value={value}>{value}</option>
                    )}
                </select>
            </div>
        );
    }
}
