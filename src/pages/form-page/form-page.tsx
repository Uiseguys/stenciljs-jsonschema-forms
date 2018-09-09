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
      "properties": {
        "title": {
          "$id": "data/properties/title",
          "type": "string",
          "title": "Title",
          "description": "Please provide a title for this"
        },
        "authorFirstName": {
          "$id": "data/properties/authorFirstName",
          "type": "string",
          "title": "First Name",
          "description": "Please provide your first name"
        },
        "authorLastName": {
          "$id": "data/properties/authorLastName",
          "type": "string",
          "title": "Last Name",
          "description": "Please provide your last name"
        },
        "description": {
          "$id": "data/properties/description",
          "type": "string",
          "title": "Description",
          "description": "Please provide a long description"
        }
      },
      "required": ["title", "authorFirstName", "authorLastName", "description"],
      "definitions": {}
    };

    this.form = {
      "title": "My Title",
      "authorFirstName": "John",
      "authorLastName": "Doe",
      "description": "Lorem ipsum"
    };

    /*
    this.schema = {
      "type": "object",
      "required": ["checkbox", "min", "max", "startDate", "endDate", "startDateString", "endDateString", "dropdown", "autocomplete", "wysiwygEditor"],
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
          "placeholder": "Check Me"
        },
        "duration": {
          "$id": "data/properties/duration",
          "type": "object",
          "properties": {
            "min": {
              "$id": "data/properties/duration/properties/min",
              "type": "string",
              "placeholder": "Min Value"
            },
            "max": {
              "$id": "data/properties/duration/properties/max",
              "type": "string",
              "placeholder": "Max Value"
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
          "placeholder": "Start Date"
        },
        "endDateString": {
          "$id": "data/properties/endDateString",
          "type": "string",
          "placeholder": "End Date"
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
        },
        "wysiwygEditor": {
          "$id": "data/properties/wysiwygEditor",
          "type": "string",
          "stringType": "textarea",
          "fencing": true,
          "html": true,
          "markdown": true,
          "wysiwyg": true
        },
        "vegetables": {
          "$id": "data/properties/vegetables",
          "type": "array",
          "arrayType": "autocomplete",
          "items": { "$ref": "#/definitions/veggie" }
        }
      },
      "definitions": {
        "veggie": {
          "$id": "data/properties/vegetables#/definitions/veggie",
          "type": "object",
          "properties": {
            "veggieName": {
              "type": "string",
              "description": "The name of the vegetable."
            },
            "veggieLike": {
              "type": "boolean",
              "description": "Do I like this vegetable?"
            }
          },
          "searchKey": "veggieName",
          "required": [ "veggieName", "veggieLike" ],
          "placeholder": "Search something e.g. 'Argentina'"
        }
      }
    };
    */

    /*
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
      "dropdown": [],
      "wysiwygEditor": "<strong>Initial Text</strong>",
      "vegetables": [
        {
          "veggieName": "potato",
          "veggieLike": true
        },
        {
          "veggieName": "broccoli",
          "veggieLike": false
        }
      ]
    };
  };
  */
  }

  render() {
    // <form-generator schema={this.schema} value={this.form}>
    //   <cwc-inlineedit forType="string" />
    //   <cwc-datepicker forType="date" />
    //   <cwc-autocomplete-select forType="autocomplete" />
    //   <cwc-combobox forType="dropdown" />
    //   <checkbox-generator forType="boolean" />
    //   <cwc-wysiwyg-editor forType="textarea" />
    // </form-generator>
    return (
      <form-generator schema={this.schema} value={this.form}>
        <cwc-inlineedit for="string" />
        <cwc-inlineedit-textarea for="data/properties/description" />
      </form-generator>
    );
  }
}
