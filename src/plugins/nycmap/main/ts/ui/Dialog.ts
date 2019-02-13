import { Editor } from 'tinymce/core/api/Editor';

import { Types } from '@ephox/bridge';

const sizeInput: Types.Dialog.BodyComponentApi = {
  type: 'sizeinput',
  name: 'dimensions',
  label: 'Constrain proportions',
  constrain: true
};

const styleSelect: Types.Dialog.BodyComponentApi = {
  type: 'selectbox',
  name: 'style',
  label: 'Style',
  items: [{text: 'Minimal', value: 'min'}, {text: 'Full', value: 'full'}]
};

const styleTab = {
  title: 'Style',
  items: [sizeInput, styleSelect]
};

const searchCheck: Types.Dialog.BodyComponentApi = {
  type: 'checkbox',
  name: 'search',
  label: 'Include a search box'
};

const searchTab = {
  title: 'Search',
  items: [searchCheck]
};

const tabs = [styleTab, searchTab];

const body: Types.Dialog.TabPanelApi = {
  type: 'tabpanel',
  tabs
};

const onSubmit = () => () => {
};
const onChange = () => () => {
};

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
    onSubmit: onSubmit(),
    onChange: onChange()
  });
};

export default {
  showDialog
};
