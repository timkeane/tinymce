const panel : any = { 
  title: 'NYC Map - CSV Data',
  body: {
    type: 'panel',
    items: [
      {
        type: 'input',
        name: 'csv_url',
        label: 'CSV URL'
      }
    ]
  }
};
export default panel;
