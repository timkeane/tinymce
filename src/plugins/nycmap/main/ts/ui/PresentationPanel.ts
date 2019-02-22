const panel : any = { 
  title: 'NYC Map - Locations Presentation',
  body: {
    type: 'panel',
    items: [
      {
        type: 'input',
        name: 'presentation_name',
        label: 'Location type name'
      },
      {
        type: 'selectbox',
        name: 'presentation_list',
        label: 'Include location list below map',
        items: [
          {text: 'No', value: 'no'},
          {text: 'Yes', value: 'yes'}
        ]
      },
      {
        type: 'selectbox',
        name: 'presentation_marker',
        label: 'Marker type',
        items: [
          {text: 'Circle', value: 'circle'},
          {text: 'Icon', value: 'icon'}
        ]
      }
    ]
  }
};
export default panel;
