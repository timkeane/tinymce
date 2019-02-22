const panel : any = { 
  title: 'NYC Map - Socrata Data',
  body: {
    type: 'panel',
    items: [
      {
        type: 'input',
        name: 'socrata_url',
        label: 'Socrata URL'
      },
      {
        type: 'input',
        name: 'socrata_resource',
        label: 'Resource Id'
      }  
    ]
  }
};
export default panel;
