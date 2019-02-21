export default {
  title: 'NYC Map - Style',
  body: {
    type: 'panel',
    items: [
      {
        type: 'selectbox',
        name: 'style_style',
        label: 'Style',
        items: [
          {text: 'Minimal', value: 'min'},
          {text: 'Full', value: 'full'}
        ]
      }
    ]
  }
};