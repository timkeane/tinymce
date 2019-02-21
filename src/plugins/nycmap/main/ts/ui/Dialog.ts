import { Editor } from 'tinymce/core/api/Editor';

import { Types } from '@ephox/bridge';
import { PublicTypes } from '@ephox/bridge';
import { window } from '@ephox/dom-globals';

const styleSelect: PublicTypes.SelectBoxApi = {
  type: 'selectbox',
  name: 'style_style',
  label: 'Style',
  items: [
    {text: 'Minimal', value: 'min'},
    {text: 'Full', value: 'full'}
  ]
};

const styleTab = {
  title: 'Style',
  items: [styleSelect]
};

const searchSelect: PublicTypes.SelectBoxApi = {
  type: 'selectbox',
  name: 'search_location',
  label: 'Search box location',
  items: [
    {text: 'None', value: 'none'},
    {text: 'Above the map', value: 'above'},
    {text: 'Within the map', value: 'within'}
  ]
};

const searchUrl: PublicTypes.InputApi = {
  type: 'input',
  name: 'search_url',
  label: 'Geoclient URL'
};

const searchApp: PublicTypes.InputApi = {
  type: 'input',
  name: 'search_app',
  label: 'Geoclient App Id'
};

const searchKey: PublicTypes.InputApi = {
  type: 'input',
  name: 'search_key',
  label: 'Geoclient API Key'
};

const searchTab = {
  title: 'Search',
  items: [searchSelect, searchUrl, searchApp, searchKey]
};

const dataSelect: PublicTypes.SelectBoxApi = {
  type: 'selectbox',
  name: 'data_source',
  label: 'Add location data',
  items: [
    {text: 'None', value: 'none'},
    {text: 'From CSV URL', value: 'csv'},
    {text: 'From Socrata', value: 'socrata'}
  ]
};

const dataUrl: PublicTypes.InputApi = {
  type: 'input',
  name: 'data_url',
  label: 'CSV URL'
};

const dataSocrata: PublicTypes.InputApi = {
  type: 'input',
  name: 'data_socrata',
  label: 'Socrata Resource Id'
};

const dataTab = {
  title: 'Data',
  items: [dataSelect, dataUrl, dataSocrata]
};

const presentSelect: PublicTypes.SelectBoxApi = {
  type: 'selectbox',
  name: 'present_list',
  label: 'Include location list below map',
  items: [
    {text: 'No', value: 'no'},
    {text: 'Yes', value: 'yes'}
  ]
};

const presentName: PublicTypes.InputApi = {
  type: 'input',
  name: 'present_name',
  label: 'Location type name'
};

const presentMarker: PublicTypes.SelectBoxApi = {
  type: 'selectbox',
  name: 'present_marker',
  label: 'Marker type',
  items: [
    {text: 'Icon', value: 'icon'},
    {text: 'Circle', value: 'circle'}
  ]
};

const presentUrl: PublicTypes.InputApi = {
  type: 'input',
  name: 'present_url',
  label: 'Marker icon URL'
};

const presentColor: PublicTypes.ColorInputApi = {
  type: 'colorinput',
  name: 'present_color',
  label: 'Marker color',
  
};

const presentTab = {
  title: 'Presentation',
  items: [presentSelect, presentName, presentMarker, presentUrl, presentColor]
};

const startInput: PublicTypes.InputApi = {
  type: 'input',
  name: 'start_at',
  label: 'Start at address'
};

const startTab = {
  title: 'Start At',
  items: [startInput]
};

const tabs = [styleTab, searchTab, dataTab, presentTab, startTab];

const body: Types.Dialog.TabPanelApi = {
  type: 'tabpanel',
  tabs
};

const onSubmit = (dia) => {
  dia.close();
};

const onChange = (dia) => {
  window.dia_=dia
  const data = dia.getData();
  console.warn(dataSelect,dia,data);
}

const showDialog = function (editor: Editor) {
  editor.windowManager.open({
    title: 'Add NYC Map',
    size: 'large',
    body,
    buttons: [
      {
        type: 'cancel',
        name: 'cancel',
        text: 'Cancel',
      },
      {
        type: 'submit',
        name: 'save',
        text: 'Save',
        primary: true
      }
    ],
    onSubmit: onSubmit,
    onChange: onChange,
    initialData: {
      search_url: 'https://maps.nyc.gov/geoclient/v1/',
      present_color: 'blue'
    }
  });
};

export default {
  showDialog
};
