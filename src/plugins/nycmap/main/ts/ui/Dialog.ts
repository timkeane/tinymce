/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { Merger, Obj, Arr } from '@ephox/katamari';
import Tools from 'tinymce/core/api/util/Tools';
import { Editor } from 'tinymce/core/api/Editor';

import Settings from '../api/Settings';
import HtmlToData from '../core/HtmlToData';
import Service from '../core/Service';
import Size from '../core/Size';
import UpdateHtml from '../core/UpdateHtml';
import { Types } from '@ephox/bridge';


const showDialog = function (editor: Editor) {

  const onSubmit = () => () => {
  };
  const onChange = () => () => {
  };
  
  const dialogSpec = (bodyItems: Types.Dialog.BodyComponentApi[], initialData: DialogData): Types.Dialog.DialogApi<DialogData> => ({
    title: 'Add NYC Map',
    size: 'large',
    body: {
      type: 'panel',
      items: [{
        type: 'selectbox',
        name: 'template',
        label: 'Templates',
        items: []
      }]
    },
    initialData,
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

  editor.windowManager.open(dialogSpec([], { template: '', preview: '' }));

};

export default {
  showDialog
};
