import {Component, Prop, State, Event, EventEmitter, Element} from '@stencil/core';
import Pikaday from 'pikaday/pikaday.js';   // disable the listener to support shadow DOM
import * as moment_ from 'moment';

@Component({
    tag: 'input-generator',
    shadow: false,
    styleUrl: 'input-generator.scss'
})
export class InputGeneratorComponent {
    moment = moment_;

    @State() currentValue: string;
    @State() currentDate: any;

    @Prop() id: string;
    @Prop() for: string;
    @Prop() value: any;
    @Prop() format: any;
    @Prop() labelContent: string;
    @Prop() placeholder: string;

    @Event() postValue: EventEmitter;
    @Element()
    element: HTMLElement;

    componentWillLoad() {
        if (this.for === "object") {
            this.currentValue = this.value ? this.value : "";
        }
        if (this.for === "integer") {
            this.currentValue = this.value || null;
        }
        if (this.for === "string") {
            this.currentValue = this.value ? JSON.parse(this.value) : "";
        }
    };

    componentDidLoad() {
        const _self = this;

        if (this.for === "object" && this.format === "date") {
            const picker = new Pikaday({
                field: this.element && this.element.querySelector("input"),
                onSelect: function (date) {
                    _self.currentValue = _self.moment(date).format('Do MMMM YYYY');
                }
            });
            picker._onClick = null;   // disable the listener to support shadow DOM
        }
    };

    getAndPostTextValue(event) {
        if (event.currentTarget.value) {
            this.for === "integer" ?
                this.currentValue = JSON.parse(event.currentTarget.value) : this.currentValue = event.currentTarget.value;
        } else {
            this.currentValue = null;
        }
        this.postValue.emit(this.element);
    };

    getContent() {
        let content =
            <input type={this.for === "integer" ? "number" : "text"} class="form-control" id={this.id}
                   value={this.currentValue} placeholder={this.placeholder}
                   onInput={(event) => this.getAndPostTextValue(event)}/>;
        if (this.format === "date") {
            content =
                <input type={this.for === "integer" ? "number" : "text"} class="form-control" id={this.id}
                       value={this.currentValue} placeholder={this.placeholder}
                       onInput={(event) => this.getAndPostTextValue(event)}
                       onChange={(event) => this.getAndPostTextValue(event)} />;
        }
        return content;
    };

    render() {
        const content = this.getContent();

        return (
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">{this.labelContent}</label>
                <div class="col-sm-10">
                    {content}
                </div>
            </div>
        );
    }
}
