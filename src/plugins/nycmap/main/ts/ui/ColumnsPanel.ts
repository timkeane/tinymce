import XHR from 'tinymce/core/api/util/XHR'

const panel : any = { 
  title: 'NYC Map - Socrata Columns',
  body: {
    type: 'panel',
    items: [
      {
        type: 'selectbox',
        name: 'ID',
        label: 'ID (Unique Identifier)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'X',
        label: 'X (EPSG:2263 X Ordinate)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'Y',
        label: 'Y (EPSG:2263 Y Ordinate)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'LNG',
        label: 'LNG (Longitude)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'LAT',
        label: 'LAT (Latitude)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'NAME',
        label: 'NAME (Facility Name)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'ADDR1',
        label: 'ADDR1 (Address Line 1)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'ADDR2',
        label: 'ADDR2 (Address Line 2)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'CITY',
        label: 'CITY (City)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'BORO',
        label: 'BORO (Borough)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'STATE',
        label: 'STATE (State)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'ZIP',
        label: 'ZIP (ZIP Code)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'PHONE',
        label: 'PHONE (10 Digit Phone Number)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'EMAIL',
        label: 'EMAIL (Email)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'WEBSITE',
        label: 'WEBSITE (Web site URL)',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'DETAIL',
        label: 'DETAIL (Text or HTML Description)',
        items: [{text: '', value: ''}]
      }
    ]
  }
};

export const showColumns = (data, callback) => {
  const pnl = panel;
  XHR.send({
    url: `${data.socrata_url}/resource/${data.socrata_resource}.csv?$where=${encodeURIComponent('0=1')}`,
    success: (columns) => {
      columns.split(',').forEach(col => {
        const socrata = col.replace(/"/g, '')
        pnl.body.items.forEach(it => {
          it.items.push({text: socrata, value: socrata});
        });
      });
      callback(pnl);
    }
 });
  
};

export default panel;