import { Element, Component, Prop, State, Listen, Watch, Event, EventEmitter } from '@stencil/core';
import Ajv from 'ajv/dist/ajv.min.js';

@Component({
  tag: 'form-generator',
  shadow: false,
  styleUrl: 'form-generator.scss'
})

export class FormGeneratorComponent {
  ajv: any;

  mapping: Object = {}; // properties of the JSON schema

  @Element() el: HTMLElement;
  @Event() onSubmit: EventEmitter;

  @Prop() schema: any;
  @Prop() value: any;

  @State() form: any = '';
  @State() schemaDefinitions: any;
  @State() allTitles: any = {};
  @State() data: any;
  @State() changedData: any;
  @State() invalidMessage: string = null;
  @State() changeValueChecked: boolean = false;

  @Listen('onChange')
  postValueHandler(CustomEvent) {
    const { id, checked, type, value } = CustomEvent.detail;
    let fieldId: any = id.match(/\w+$/)[0];
    let fieldValue: any = (type === 'checkbox') ? checked : value;
    let currentFormData: any = this.data;

    this.changeValueChecked = true;
    currentFormData = this.fillData(fieldId, fieldValue, currentFormData);
    let clearedFormData = Object.assign({}, currentFormData);
    this.changedData = this.deletePropsWithoutData(clearedFormData);
  };

  @Watch('schema')
  renderForm() {
    this.schemaDefinitions = this.schema.definitions;
    this.form = this.createForm(this.schema.properties, null);
  }

  constructor() {
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  componentWillLoad() {
    this.ajv = new Ajv({allErrors: true});
    this.data = Object.assign({}, this.value);
    this.createFormElementsMapping();
  }

  componentDidLoad() {
    this.schemaDefinitions = this.schema.definitions;
    this.form = this.createForm(this.schema.properties, null);
  }

  createFormElementsMapping() {
    let mapKey: string;
    for (let i = 0; i < this.el.children.length; i++) {
      let child = this.el.children[i];

      if (child['for']) {
        mapKey = child['for'];
      } else {
        mapKey = child.getAttribute('for');
      }

      this.mapping[mapKey] = {
        props: JSON.parse(child.getAttribute('props')),
        Tag: child['localName']
      };
    }

    this.el.innerHTML = "";
  }

  createForm(schemaProps, schemaPropKey) {
    return Object.keys(schemaProps).map((prop: any) => {
      if (schemaProps[prop].hasOwnProperty("properties")) {
        schemaPropKey = prop;
        return this.createForm(schemaProps[prop].properties, schemaPropKey);
      } else {
        this.allTitles[prop] = prop;
        return this.createField(schemaProps, prop, schemaPropKey);
      }
    })
  };

  createField(schemaProps: any, prop: any, schemaPropKey: any) {
    const { arrayType, format, stringType } = schemaProps[prop];

    if (format === "date") {
      return this.createDate(schemaProps, prop);
    }

    if (stringType === "textarea") {
      return this.createTextarea(schemaProps, prop);
    }

    if (arrayType === "autocomplete") {
      return this.createAutocomplete(schemaProps, prop);
    }

    if (arrayType === "dropdown") {
      return this.createDropdown(schemaProps, prop);
    }

    return this.createDefault(schemaProps, prop, schemaPropKey);
  };

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

  getRefDefinition(property: any) {
    let itemsRef = property.items.$ref.split('/').pop();
    return this.schemaDefinitions[itemsRef];
  }

  /* TODO: These fn should dissapear at some point */
  createDate(schemaProps: any, prop: any) {
    let Tag = this.mapping[this.getMappedElement(schemaProps[prop])];
    const { $id } = schemaProps[prop];
    const { dateFormat, endDate, lang, startDate } = this.value[prop];
    return (
      <Tag id={$id}
        label={prop}
        format={dateFormat}
        end-date={endDate}
        start-date={startDate}
        lang={lang}
      />
    );
  }

  createTextarea(schemaProps: any, prop: any) {
    let Tag = this.mapping[this.getMappedElement(schemaProps[prop])];
    const { $id, fencing, html, markdown, wysiwyg } = schemaProps[prop];
    return (
      <Tag id={$id}
        label={prop}
        fencing={fencing}
        html={html}
        markdown={markdown}
        wysiwyg={wysiwyg}
      >
        {this.value[prop]}
      </Tag>
    );
  }

  createAutocomplete(schemaProps: any, prop: any) {
    let Tag = this.mapping[this.getMappedElement(schemaProps[prop])];
    const { $id } = schemaProps[prop];
    const propItems = schemaProps[prop].items.hasOwnProperty('$ref') ?
      this.getRefDefinition(schemaProps[prop])
      : schemaProps[prop].items;

    const { enum: items, placeholder, searchKey } = propItems;

    return (
      <Tag id={$id}
        label={prop}
        value={this.value[prop]}
        data={items}
        searchKey={searchKey}
        placeholder={placeholder}
      />
    );
  }

  createDropdown(schemaProps: any, prop: any) {
    let showField = true;
    let Tag = this.mapping[this.getMappedElement(schemaProps[prop])];
    const { $id } = schemaProps[prop];
    const propItems = schemaProps[prop].items.hasOwnProperty('$ref') ?
      this.getRefDefinition(schemaProps[prop])
      : schemaProps[prop].items;

    let { enum: items } = propItems;
    const {
      buttonText, buttonLeftPosition, placeholder, readonly, if: ifCond
    } = propItems;

    if (ifCond) { showField = false; }

    if (this.changedData && ifCond) {
      const getItems = ({if: ifCond, then: thenCond, else: elseCond }) => {
        const firstCond = Object.keys(ifCond)[0];
        const changedData = Object.keys(this.changedData).find(key => key === firstCond);

        if (firstCond === changedData) {
          if (ifCond[firstCond].toString() === this.changedData[changedData].toString()) {
            showField = true;
            return thenCond.data;
          } else if (elseCond) {
            return getItems({
              if: elseCond.if,
              then: elseCond.then,
              else: elseCond.else
            });
          }
        }
      }

      items = getItems(schemaProps[prop].items);
    }

    return (
      showField ?
      <Tag id={$id}
        label={prop}
        data={items || this.value[prop]}
        btnText={buttonText}
        btnLeftPosition={buttonLeftPosition}
        placeholder={placeholder}
        readonly={readonly}
      /> : null
    );
  }
  /* TODO: These fn should dissapear at some point */

  createDefault(schemaProps: any, prop: any, schemaPropKey: any) {
    let propItems: any;
    let { Tag, props } = this.getMappedElement(schemaProps[prop]);
    const { $id, type, title, description, items } = schemaProps[prop];

    /* <for arrays> */
    if (items) {
      propItems = items.hasOwnProperty('$ref') ?
      this.getRefDefinition(schemaProps[prop])
      : items;
    }
    /* </for arrays> */

    return (
      <Tag
        id={$id}
        label={title}
        value={
          (this.value[prop] || this.value[prop] === false) ?
            JSON.stringify(this.value[prop])
            : this.value[schemaPropKey][prop]
        }
        data={propItems && propItems.enum || null}
        searchKey={props && props.searchKey || null}
        placeholder={description}
        for={type} // TODO: this should dissapear
      /> || null
    );
  }

  render() {
    return (
      <div>
        <div class="form-container">
          {this.invalidMessage && (
            <div class="alert alert-danger">
              <span>{this.invalidMessage}</span>
            </div>
          )}
          {this.form}
        </div>
        <input class="btn btn-outline-primary" type="submit" value="Validate" onClick={this.onSubmitHandler}/>
    </div>
    );
  }


  onSubmitHandler() {
    this.validateForm();
    if (!this.invalidMessage) {
      this.onSubmit.emit(this.changedData ? this.changedData : this.value);
    }
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
    let { $id, type, format, arrayType, stringType } = schemaProps;
    // TODO: need to refactor this
    if (format === 'date') { return format; }
    if (stringType === 'textarea') { return stringType; }
    if (arrayType === 'autocomplete') { return arrayType; }
    if (arrayType === 'dropdown') { return arrayType; }

    if (this.mapping[$id]) {
      return this.mapping[$id];
    } else {
      return this.mapping[type];
    }
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
