import {Component, State} from '@stencil/core';

@Component({
  tag: 'linked-interface',
  shadow: false,
})

export class LinkedInterface {
  @State() schema: any;
  @State() form: any;

  componentWillLoad() {
    this.schema = {
      "type": "object",
      "properties": {
        "dropdown1": {
          "$id": "data/properties/dropdown1",
          "type": "array",
          "arrayType": "dropdown",
          "items": {
            "$id": "/properties/dropdown1/items",
            "type": "string",
            "buttonText": "",
            "buttonLeftPosition": true,
            "placeholder": "Select a value",
            "readonly": true,
            "enum": ["Windows", "OSX", "Linux"]
          }
        },
        "dropdown2": {
          "$id": "data/properties/dropdown2",
          "type": "array",
          "arrayType": "dropdown",
          "items": {
            "$id": "/properties/dropdown2/items",
            "type": "string",
            "buttonText": "",
            "buttonLeftPosition": true,
            "placeholder": "Select a value",
            "readonly": true,
            "if": { "dropdown1": ["Windows"] },
            "then": { "data": ["7", "10"] },
            "else": {
              "if": { "dropdown1": ["OSX"] },
              "then": { "data": ["High Sierra", "Mojave"] },
              "else": {
                "if": { "dropdown1": ["Linux"] },
                "then": { "data": ["Linux Mint", "Ubuntu"] }
              }
            },
            "enum": [
              "7",
              "10",
              "High Sierra",
              "Mojave",
              "Linux Mint",
              "Ubuntu"
            ]
          }
        },
        "dropdown3": {
          "$id": "data/properties/dropdown3",
          "type": "array",
          "arrayType": "dropdown",
          "items": {
            "$id": "/properties/dropdown3/items",
            "type": "string",
            "buttonText": "",
            "buttonLeftPosition": true,
            "placeholder": "Select a value",
            "readonly": true,
            "if": { "dropdown2": ["7"] },
            "then": { "data": ["Office Word 2007", "Notepad 2007"] },
            "else": {
              "if": { "dropdown2": ["10"] },
              "then": { "data": ["Office Word 2010", "Notepad 2010"] },
              "else": {
                "if": { "dropdown2": ["High Sierra"] },
                "then": { "data": ["Libre office - Low Sierra", "Libre office - High Sierra"] },
                "else": {
                  "if": { "dropdown2": ["Mojave"] },
                  "then": { "data": ["Libre office - Low Mojave", "Libre office - High Mojave"] },
                  "else": {
                    "if": { "dropdown2": ["Linux Mint"] },
                    "then": { "data": ["Linux office - Linux Mint", "Linux office - Linux Chocollate"] },
                    "else": {
                      "if": { "dropdown2": ["Ubuntu"] },
                      "then": { "data": ["Ubuntu office - Low Ubuntu", "Ubuntu office - High Ubuntu"] }
                    }
                  }
                }
              }
            },
            "enum": [
              "Office Word 2007",
              "Notepad 2007",
              "Office Word 2010",
              "Notepad 2010",
              "Libre office - Low Sierra",
              "Libre office - High Sierra",
              "Libre office - Low Mojave",
              "Libre office - High Mojave",
              "Linux office - Linux Mint",
              "Linux office - Linux Chocollate",
              "Ubuntu office - Low Ubuntu",
              "Ubuntu office - High Ubuntu"
            ]
          }
        },
        "dropdown4": {
          "$id": "data/properties/dropdown4",
          "type": "array",
          "arrayType": "dropdown",
          "items": {
            "$id": "/properties/dropdown4/items",
            "type": "string",
            "buttonText": "",
            "buttonLeftPosition": true,
            "placeholder": "Select a value",
            "readonly": true,
            "if": { "dropdown3": ["Office Word 2007"] },
            "then": { "data": ["Powerpoint", "SharePoint"] },
            "else": {
              "if": { "dropdown3": ["Notepad 2007"] },
              "then": { "data": ["Notepad Plus", "Notepad++"] },
              "else": {
                "if": { "dropdown3": ["Office Word 2010"] },
                "then": { "data": ["Outlook", "Excel"] },
                "else": {
                  "if": { "dropdown3": ["Notepad 2010"] },
                  "then": { "data": ["Notepad Plus 2010", "Notepad++ 2010"] },
                  "else": {
                    "if": { "dropdown3": ["Libre office - Low Sierra"] },
                    "then": { "data": ["Office Low Sierra 1", "Office Low Sierra 2"] },
                    "else": {
                      "if": { "dropdown3": ["Libre office - High Sierra"] },
                      "then": { "data": ["Office High Sierra 1", "Office High Sierra 2"] },
                      "else": {
                        "if": { "dropdown3": ["Libre office - Low Mojave"] },
                        "then": { "data": ["Office Low Mojave 1", "Office Low Mojave 2"] },
                        "else": {
                          "if": { "dropdown3": ["Libre office - High Mojave"] },
                          "then": { "data": ["Office High Mojave 1", "Office High Mojave 2"] },
                          "else": {
                            "if": { "dropdown3": ["Linux office - Linux Mint"] },
                            "then": { "data": ["Office Linux Mint 1", "Office Linux Mint 2"] },
                            "else": {
                              "if": { "dropdown3": ["Linux office - Linux Chocollate"] },
                              "then": { "data": ["Office Linux Chocollate 1", "Office Linux Chocollate 2"] },
                              "else": {
                                "if": { "dropdown3": ["Ubuntu office - Low Ubuntu"] },
                                "then": { "data": ["Office Low Ubuntu 1", "Office Low Ubuntu 2"] },
                                "else": {
                                  "if": { "dropdown3": ["Ubuntu office - High Ubuntu"] },
                                  "then": { "data": ["Office High Ubuntu 1", "Office High Ubuntu 2"] }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "enum": [
              "Powerpoint",
              "SharePoint",
              "Notepad Plus",
              "Notepad++",
              "Outlook", "Excel",
              "Notepad Plus 2010",
              "Notepad++ 2010",
              "Office Low Sierra 1",
              "Office Low Sierra 2",
              "Office High Sierra 1",
              "Office High Sierra 2",
              "Office Low Mojave 1",
              "Office Low Mojave 2",
              "Office High Mojave 1",
              "Office High Mojave 2",
              "Office Linux Mint 1",
              "Office Linux Mint 2",
              "Office Linux Chocollate 1",
              "Office Linux Chocollate 2",
              "Office Low Ubuntu 1",
              "Office Low Ubuntu 2",
              "Office High Ubuntu 1",
              "Office High Ubuntu 2"
            ]
          }
        }
      },
      "required": ["dropdown1"],
      "dependencies": {
        "dropdown1": ["dropdown2"],
        "dropdown2": ["dropdown3"],
        "dropdown3": ["dropdown4"]
      }
    }

    this.form = {
      "dropdown1": [],
      "dropdown2": [],
      "dropdown3": [],
      "dropdown4": []
    }
  }

  render() {
    return (
      <form-generator schema={this.schema} value={this.form}>
        <cwc-combobox for="dropdown" />
      </form-generator>
    );
  }
}
