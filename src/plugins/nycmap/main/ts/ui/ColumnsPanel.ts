import XHR from 'tinymce/core/api/util/XHR'

const panel : any = { 
  title: 'NYC Map - Socrata Columns',
  body: {
    type: 'panel',
    items: [
      {
        type: 'selectbox',
        name: 'ID',
        label: 'ID',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'X',
        label: 'X',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'Y',
        label: 'Y',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'LNG',
        label: 'LNG',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'LAT',
        label: 'LAT',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'NAME',
        label: 'NAME',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'ADDR1',
        label: 'ADDR1',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'ADDR2',
        label: 'ADDR2',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'CITY',
        label: 'CITY',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'BORO',
        label: 'BORO',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'STATE',
        label: 'STATE',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'ZIP',
        label: 'ZIP',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'PHONE',
        label: 'PHONE',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'EMAIL',
        label: 'EMAIL',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'WEBSITE',
        label: 'WEBSITE',
        items: [{text: '', value: ''}]
      },
      {
        type: 'selectbox',
        name: 'DETAIL',
        label: 'DETAIL',
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
      console.warn(pnl);
      callback(pnl);
    }
 });
  
};

export default panel;