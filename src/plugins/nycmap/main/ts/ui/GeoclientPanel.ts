const panel : any = { 
  title: 'NYC Map - Geoclient',
  body: {
    type: 'panel',
    items: [
      {
        type: 'input',
        name: 'geoclient_url',
        label: 'Geoclient URL'
      },
      {
        type: 'input',
        name: 'geoclient_app',
        label: 'Geoclient App Id'
      },
      {
        type: 'input',
        name: 'geoclient_key',
        label: 'Geoclient API Key'
      }
    ]
  }
};
export default panel;
