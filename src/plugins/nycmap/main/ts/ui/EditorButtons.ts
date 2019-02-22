import { Editor } from 'tinymce/core/api/Editor';
import { Toolbar } from '@ephox/bridge';

const stateSelectorAdapter = (editor: Editor, selector: string[]) => (buttonApi: Toolbar.ToolbarToggleButtonInstanceApi) =>
  editor.selection.selectorChangedWithUnbind(selector.join(','), buttonApi.setActive).unbind;

const register = function (editor: Editor) {
  editor.ui.registry.addToggleButton('nycmap', {
    tooltip: 'Insert/edit NYC Map',
    icon: 'embed',
    onAction: () => {
      editor.execCommand('mceNycmap');
    },
    onSetup: stateSelectorAdapter(editor, ['img[data-mce-object]', 'span[data-mce-object]', 'div[data-ephox-embed-iri]'])
  });

};

export default {
  register
};