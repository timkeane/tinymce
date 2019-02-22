import PluginManager from 'tinymce/core/api/PluginManager';
import Api from './api/Api';
import Commands from './api/Commands';
import Buttons from './ui/EditorButtons';

PluginManager.add('nycmap', function (editor) {
  Commands.register(editor);
  Buttons.register(editor);
  return Api.get(editor);
});

export default {};