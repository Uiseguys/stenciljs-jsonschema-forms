import {Element, Component, Prop, State, Listen} from '@stencil/core';
import Ajv from 'ajv/dist/ajv.min.js';

@Component({
  tag: 'form-generator',
  shadow: false,
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
    let fieldType: string = CustomEvent.detail.type;

    let fieldValue: any = (fieldType === 'checkbox') ?
      CustomEvent.detail.checked
      : CustomEvent.detail.value;

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

    this.el.innerHTML = "";
  }

  /**
   * Functions for filling data object
   */
  fillData(fieldId, fieldValue, currentFormData) {
    Object.keys(currentFormData).map((key) => {
      if (key === fieldId) {
        if (Array.isArray(currentFormData[key])) {
          if (Array.isArray(fieldValue)) {
            currentFormData[key] = fieldValue;
          } else {
            if (!fieldValue) {
              currentFormData[key] = fieldValue;
            } else {
              currentFormData[key] = [];
              currentFormData[key][0] = fieldValue;
            }
          }
        } else {
          if (this.schema.properties[key] && this.schema.properties[key].format && this.schema.properties[key].format === "date") {
            currentFormData[key].endDate = fieldValue.endDate;
            currentFormData[key].startDate = fieldValue.startDate;
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
   * Getting fields based on properties in JSON-schema
   */
  createField(schemaProps: any, prop: any, schemaPropKey: any) {
    let Tag = this.mapping[this.getMappedElement(schemaProps[prop])];
    let id: string = schemaProps[prop].$id;
    let placeholder: string = schemaProps[prop].placeholder;
    this.allTitles[prop] = prop;

    if (schemaProps[prop].format === "date") {
      return (
        <Tag id={id}
          format={this.value[prop].dateFormat}
          end-date={this.value[prop].endDate}
          start-date={this.value[prop].startDate}
          label={prop}
        />
      );
    }

    if (schemaProps[prop].arrayType === "autocomplete") {
      return (
        <Tag id={id}
          data={schemaProps[prop].items.enum}
          searchKey={schemaProps[prop].items.searchKey}
          label={prop}
          placeholder={schemaProps[prop].items.placeholder}
        />
      );
    }

    if (schemaProps[prop].arrayType === "dropdown") {
      return (
        <Tag id={id}
          data={schemaProps[prop].items.enum}
          label={prop}
          btnText={schemaProps[prop].items.buttonText}
          btnLeftPosition={schemaProps[prop].items.buttonLeftPosition}
          placeholder={schemaProps[prop].items.placeholder}
          readonly={schemaProps[prop].items.readonly}
        />
      );
    }

    return (
      <Tag id={id}
        for={schemaProps[prop].type}
        format={schemaProps[prop].format || null}
        value={(this.value[prop] || this.value[prop] === false) ?
          JSON.stringify(this.value[prop])
          : this.value[schemaPropKey][prop]
        }
        label={prop}
        placeholder={placeholder}/> || null
    );
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
        <div class="form-container">
          {message}
          {form}
        </div>
        <input class="btn btn-outline-primary" type="submit" value="Validate" onClick={() => this.validateForm()}/>
    </div>
    );
  }

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
   * Functions for deleting properties which have value "null"
   */
  deletePropsWithoutData(clearedFormData) {
    let formData = Object.assign({}, clearedFormData);
    Object.keys(formData).map((key) => {
      if (!formData[key] || formData[key] === null || formData[key] === false || formData[key].length === 0) {
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

  getMappedElement(schemaProps) {
    let { type, format, arrayType } = schemaProps;
    if (format === 'date') { return format; }
    if (arrayType === 'autocomplete') { return arrayType; }
    if (arrayType === 'dropdown') { return arrayType; }
    return type;
  }

  updateValidationMessage(validate) {
    let unchangedMessage: any = this.ajv.errorsText(validate.errors).replace(/\,?\w*\.?\w*\./g, "").split(" ");
    Object.keys(this.allTitles).map((prop: string) => {
      for (let el in unchangedMessage) {
        if (unchangedMessage[el] === prop) {
          unchangedMessage[el] = this.allTitles[prop];
        }
      }
    });
    return unchangedMessage.toString().replace(/\,(?!\,)/g, " ");
  };
}
