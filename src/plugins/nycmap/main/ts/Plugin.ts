import PluginManager from 'tinymce/core/api/PluginManager';
import Api from './api/Api';
import Commands from './api/Commands';
import Buttons from './ui/EditorButtons';
import Observer from './core/Observer';

PluginManager.add('nycmap', editor => {
  Commands.register(editor);
  Buttons.register(editor);
  editor.on('init', () => {
    Observer.observe(editor);
  });
  return Api.get(editor);
});

export default {};