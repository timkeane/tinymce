export default {
  title: 'NYC Map - Search',
  body: {
    type: 'panel',
    items: [
      {
        type: 'selectbox',
        name: 'search_location',
        label: 'Search box location',
        items: [
          {text: 'None', value: 'none'},
          {text: 'Above the map', value: 'above'},
          {text: 'Within the map', value: 'within'}
        ]
      }
    ]
  }
};
