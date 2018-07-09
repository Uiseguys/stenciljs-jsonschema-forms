import {Element, Component, Prop, State, Listen} from '@stencil/core';
import Ajv from 'ajv/dist/ajv.min.js';

@Component({
    tag: 'form-generator',
    shadow: true,
    styleUrl: 'form-generator.scss'
})
export class FormGeneratorComponent {
    mapping: Object = {}; // properties of the JSON schema
    ajv: any;
    @State() allTitles: any = {};
    @State() data: any;
    @State() changedData: any;
    @State() invalidMessage: string = null;
    @State() changeValueChecked: boolean = false;

    /**
     * @desc Field data change callback
     * @Prop {any} schema - JSON-schema
     * @Prop {any} form - form for JSON-schema
     */
    @Prop() schema: any;
    @Prop() value: any;

    @Element() el: HTMLElement;

    @Listen('postValue')
    postValueHandler(CustomEvent) {
        this.changeValueChecked = true;

        let fieldId: any = CustomEvent.detail.id.match(/\w+$/)[0];
        let fieldValue: any = CustomEvent.detail.type === 'checkbox' ? CustomEvent.detail.checked : CustomEvent.detail.value;
        let currentFormData: any = this.data;

        currentFormData = this.fillData(fieldId, fieldValue, currentFormData);
        let clearedFormData = Object.assign({}, currentFormData);
        this.changedData = this.deletePropsWithoutData(clearedFormData);
    };

    componentWillLoad() {
        let mapKey;
        this.ajv = new Ajv({allErrors: true});
        this.data = Object.assign({}, this.value);

        for (let i = 0; i < this.el.children.length; i++) {
            let child = this.el.children[i];
            if (child['for']) {
                mapKey = child['for'];
            } else {
                mapKey = child.getAttribute('for');
            }
            this.mapping[mapKey] = child['localName'];
        }
    }

    /**
     * Functions for filling data object
     */
    fillData(fieldId, fieldValue, currentFormData) {
        Object.keys(currentFormData).map((key) => {
            if (key === fieldId) {
                if (Array.isArray(currentFormData[key])) {
                    currentFormData[key] = [];
                    currentFormData[key][0] = fieldValue;
                } else {
                    if (this.schema.properties[key] && this.schema.properties[key].format && this.schema.properties[key].format === "date") {
                        currentFormData[key].dateValue = fieldValue;
                    } else {
                        currentFormData[key] = fieldValue;
                    }
                }
                return currentFormData;
            }
            if ((typeof(currentFormData[key]) === "object") && (!Array.isArray(currentFormData[key])) && (currentFormData[key]) !== null) {
                currentFormData[key] = this.fillData(fieldId, fieldValue, currentFormData[key]);
            }
        });
        return currentFormData;
    };

    /**
     * Functions for deleting properties which have value "null"
     */
    deletePropsWithoutData(clearedFormData) {
        let formData = Object.assign({}, clearedFormData);
        Object.keys(formData).map((key) => {
            if (formData[key] === null || formData[key] === false) {
                delete formData[key];
                return formData;
            }
            if ((typeof(formData[key]) === "object") && (!Array.isArray(formData[key]))) {
                formData[key] = this.deletePropsWithoutData(formData[key]);
            }
        });

        return formData;
    };

    /**
     * Call functions for validate of all form fields
     */
    validateForm() {
        let validate = this.ajv.compile(this.schema);
        let dataValidate;
        if (!this.changeValueChecked) {
            // ajv.validate is not working with nested objects, so we have to make a flat clean clone to validate it,
            // otherwise we should not use nested objects as it is working correctly without them
            let flattedForm: any = this.deletePropsWithoutData(this.value);
            dataValidate = validate(this.flatDataObject(flattedForm));
        } else {
            dataValidate = validate(this.flatDataObject(this.changedData));
        }
        dataValidate ? this.invalidMessage = null : this.invalidMessage = this.updateValidationMessage(validate);
    };

    /**
     * Function for flatting data object for validation
     */
    flatDataObject(data) {
        function flat(res, key, val, pre = '') {
            let prefix: any = [pre, key].filter(v => v).join('.').match(/\w+$/);
            return (typeof val === 'object' && (!Array.isArray(val)))
                ? Object.keys(val).reduce((prev, curr) => flat(prev, curr, val[curr], prefix), res)
                : Object.assign(res, {[prefix]: val});
        }

        return Object.keys(data).reduce((prev, curr) => flat(prev, curr, data[curr]), {});
    }

    updateValidationMessage(validate) {
        let unchangedMessage: any = this.ajv.errorsText(validate.errors).replace(/\,?\w*\.?\w*\./g, "").split(" ");
        Object.keys(this.allTitles).map((labelContent: string) => {
            for (let el in unchangedMessage) {
                if (unchangedMessage[el] === labelContent) {
                    unchangedMessage[el] = this.allTitles[labelContent];
                }
            }
        });
        return unchangedMessage.toString().replace(/\,(?!\,)/g, " ");
    };

    /**
     * Getting fields based on properties in JSON-schema
     */
    createField(schemaProps: any, prop: any, schemaPropKey: any) {
        let {type} = schemaProps[prop];
        let Tag = this.mapping[type];
        let labelContent: string = schemaProps[prop].labelContent;
        let placeholder: string = schemaProps[prop].placeholder;
        let id: string = schemaProps[prop].$id;
        let elementType: string = schemaProps[prop].type;
        let elementFormat: any = schemaProps[prop].format || null;
        this.allTitles[prop] = labelContent;

        if (!labelContent) {
            schemaProps[prop].items ? labelContent = schemaProps[prop].items.labelContent : labelContent = 'Unnamed field';
            this.allTitles[prop] = labelContent;
        }

        if (schemaProps[prop].format === "date") {
            return <Tag id={id} format={elementFormat} for={elementType} value={this.value[prop].dateValue || ""}
                        label={labelContent} placeholder={placeholder}/>;
        }

        return <Tag id={id} format={elementFormat} for={elementType}
                    value={(this.value[prop] || this.value[prop] === false) ? JSON.stringify(this.value[prop]) : this.value[schemaPropKey][prop]}
                    label={labelContent} placeholder={placeholder}/> || null;

    };

    createForm(schemaProps, schemaPropKey) {
        return Object.keys(schemaProps).map((prop: any) => {
            if (schemaProps[prop].hasOwnProperty("properties")) {
                schemaPropKey = prop;
                return this.createForm(schemaProps[prop].properties, schemaPropKey);
            } else {
                return this.createField(schemaProps, prop, schemaPropKey);
            }
        })
    };

    render() {
        let message: any = null;
        let schemaProps: any = this.schema.properties;
        let form: any = this.createForm(schemaProps, null);

        if (this.invalidMessage) {
            message =
                <div class="alert alert-danger">
                    <span>{this.invalidMessage}</span>
                </div>;
        }

        return (
            <div>
                <div>
                    {message}
                    {form}
                </div>
                <slot name="slot-generator" />
                <br/>
                <input class="btn btn-outline-primary" type="submit" value="Validate" onClick={() => this.validateForm()}/>
            </div>
        );
    }
}
