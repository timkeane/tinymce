import Dialog from '../ui/Dialog';

const get = function (editor) {
  const showDialog = function () {
    Dialog.showDialog(editor);
  };

  return {
    showDialog
  };
};

export default {
  get
};