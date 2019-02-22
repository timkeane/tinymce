import Dialog from '../ui/Dialog';

const register = function (editor) {
  const showDialog = function () {
    Dialog.showDialog(editor);
  };

  editor.addCommand('mceNycmap', showDialog);
};

export default {
  register
};