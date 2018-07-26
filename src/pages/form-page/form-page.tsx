import {Component, State} from '@stencil/core';

@Component({
  tag: 'form-generator-page',
  shadow: false,
})

export class FormGeneratorPage {
  @State() schema: any;
  @State() form: any;

  componentWillLoad() {
    this.schema = {
      "type": "object",
      "required": ["checkbox", "min", "max", "startDate", "endDate", "startDateString", "endDateString", "dropdown", "autocomplete"],
      "properties": {
        "autocomplete": {
          "$id": "data/properties/autocomplete",
          "type": "array",
          "arrayType": "autocomplete",
          "items": {
            "$id": "/properties/autocomplete/items",
            "type": "object",
            "placeholder": "Search something e.g. 'Argentina'",
            "searchKey": "data.name",
            "enum": [
              {
                "type": 'country',
                "data": {
                  "name": 'Austria',
                  "capital": 'Vienna'
                }
              },
              {
                "type": 'country',
                "data": {
                  "name": 'Australia',
                  "capital": 'Canberra'
                }
              },
              {
                "type": 'country',
                "data": {
                  "name": 'Argentina',
                  "capital": 'Buenos Aires'
                }
              }
            ]
          }
        },
        "checkbox": {
          "$id": "data/properties/checkbox",
          "type": "boolean",
          "description": "An explanation about the purpose of this instance.",
          "placeholder": "Check Me",
          "default": false,
          "examples": [
            false
          ]
        },
        "duration": {
          "$id": "data/properties/duration",
          "type": "object",
          "properties": {
            "min": {
              "$id": "data/properties/duration/properties/min",
              "type": "integer",
              "description": "An explanation about the purpose of this instance.",
              "placeholder": "Min Value",
              "default": 0,
              "examples": [
                5
              ]
            },
            "max": {
              "$id": "data/properties/duration/properties/max",
              "type": "integer",
              "description": "An explanation about the purpose of this instance.",
              "placeholder": "Max Value",
              "default": 0,
              "examples": [
                10
              ]
            }
          }
        },
        "date": {
          "$id": "data/properties/date",
          "type": "object",
          "format": "date",
          "placeholder": "Select a Date",
          "startDate": {
            "$id": "data/properties/date/startDate",
            "type": "string"
          },
          "endDate": {
            "$id": "data/properties/date/endDate",
            "type": "string"
          },
          "lang": {
            "$id": "data/properties/date/lang",
            "type": "string"
          },
          "dateFormat": {
            "$id": "data/properties/date/dateFormat",
            "type": "string"
          }
        },
        "startDateString": {
          "$id": "data/properties/startDateString",
          "type": "string",
          "description": "An explanation about the purpose of this instance.",
          "placeholder": "Start Date",
          "default": "",
          "examples": [
            "2007-08-31T16:47+00:00"
          ]
        },
        "endDateString": {
          "$id": "data/properties/endDateString",
          "type": "string",
          "description": "An explanation about the purpose of this instance.",
          "placeholder": "End Date",
          "default": "",
          "examples": [
            "2007-08-31T16:47+00:00"
          ]
        },
        "dropdown": {
          "$id": "data/properties/dropdown",
          "type": "array",
          "arrayType": "dropdown",
          "items": {
            "$id": "/properties/dropdown/items",
            "type": "string",
            "buttonText": "",
            "buttonLeftPosition": false,
            "placeholder": "Select a value",
            "readonly": true,
            "enum": ["Automatic", "Manual"]
          }
        }
      }
    };

    this.form = {
      "autocomplete": [],
      "checkbox": false,
      "duration": {
        "min": 5,
        "max": 10
      },
      "date": {
        "startDate": "03/25/2018",
        "endDate": "04/12/2018",
        "lang": "en",
        "dateFormat": "MM.DD.YYYY"
      },
      "startDateString": "2007-08-31T16:47+00:00",
      "endDateString": "2007-08-31T16:47+00:00",
      "dropdown": []
    };
  };

  render() {
    return (
      <form-generator schema={this.schema} value={this.form}>
        <cwc-inlineedit for="integer"></cwc-inlineedit>
        <cwc-inlineedit for="string"></cwc-inlineedit>
        <cwc-datepicker for="date"></cwc-datepicker>
        <cwc-autocomplete-select for="autocomplete"></cwc-autocomplete-select>
        <cwc-combobox for="dropdown"></cwc-combobox>
        <checkbox-generator for="boolean"></checkbox-generator>
      </form-generator>
    );
  }
}
