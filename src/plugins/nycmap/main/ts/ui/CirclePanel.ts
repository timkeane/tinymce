const panel : any = { 
  title: 'NYC Map - Circle',
  body: {
    type: 'panel',
    items: [
      {
        type: 'colorinput',
        name: 'circle_color',
        label: 'Marker color'
      }
    ]
  }
};

export default panel;