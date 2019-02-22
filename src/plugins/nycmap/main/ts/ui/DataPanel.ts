const panel : any = { 
  title: 'NYC Map - Locations Data',
  body: {
  type: 'panel',
    items: [
      {
        type: 'selectbox',
        name: 'data_source',
        label: 'Add location data',
        items: [
          {text: 'None', value: 'none'},
          {text: 'From CSV URL', value: 'csv'},
          {text: 'From Socrata', value: 'socrata'}
        ]
      }
    ]
  }
};
export default panel;
