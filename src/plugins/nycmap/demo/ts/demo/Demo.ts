declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'nycmap',
  toolbar: 'undo redo | nycmap',
  height: 600
});

export {};