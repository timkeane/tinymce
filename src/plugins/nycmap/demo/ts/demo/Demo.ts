declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'nycmap',
  height: 600
});

export {};