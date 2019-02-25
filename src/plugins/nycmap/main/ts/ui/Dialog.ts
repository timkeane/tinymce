import panels from './Panels';
import buttons from './DialogButtons';
import { MapDialogData } from '../core/DataToHtml'
import DataToHtml from '../core/DataToHtml'
import { alert } from '@ephox/dom-globals';
import { Editor } from 'tinymce/core/api/Editor';
import UpdateHtml from '../core/UpdateHtml';
import { showColumns } from './ColumnsPanel';

const SOCRATA_URL = 'https://data.cityofnewyork.us';
const GEOCLIENT_URL = 'https://maps.nyc.gov/geoclient/v1';

let diaData : MapDialogData;
let editor : Editor;
let currentPanel;
let colorHack; /* colorpicker in CirclePanel does not fire the dialog change event */

const errorMsgs = () => {
  const errors = {
    error: false,
    geoclient: [],
    csv: [],
    socrata: [],
    columns: [],
    icon: [],
    circle: []
  };
  if (diaData.search_location !== 'none') {
    if (diaData.geoclient_url.trim().length === 0) {
      errors.geoclient.push('A Geoclient URL is required');
      errors.error = true;
    }
    if (diaData.geoclient_app.trim().length === 0) {
      errors.geoclient.push('A Geoclient App Id is required');
      errors.error = true;
    }
    if (diaData.geoclient_key.trim().length === 0) {
      errors.geoclient.push('A Geoclient App Key is required');
      errors.error = true;
    }
  }
  if (diaData.data_source === 'csv') {
    if (diaData.csv_url.trim().length === 0) {
      errors.csv.push('A CSV URL is required');
      errors.error = true;
    }
  }
  if (diaData.data_source === 'socrata') {
    if (diaData.socrata_url.trim().length === 0) {
      errors.socrata.push('A Socrata URL is required');
      errors.error = true;
    }
    if (diaData.socrata_resource.trim().length === 0) {
      errors.socrata.push('A Socrata Resource Id is required');
      errors.error = true;
    }
    if (diaData.NAME.trim().length === 0) {
      errors.columns.push('A Socrate column must be mapped to NAME');
      errors.error = true;
    } 
    if (diaData.ADDR1.trim().length === 0) {
      errors.columns.push('A Socrate column must be mapped to ADDR1');
      errors.error = true;
    }
    if (diaData.CITY.trim().length === 0 && diaData.BORO.trim().length === 0) {
      errors.columns.push('A Socrate column must be mapped to CITY or BORO');
      errors.error = true;
    }
  }
  if (diaData.presentation_marker === 'icon') {
    if (diaData.icon_url.trim().length === 0) {
      errors.icon.push('A Marker Icon Url is required');
      errors.error = true;
    }
  }
  if (diaData.presentation_marker === 'circle') {
    if (diaData.circle_color.trim().length === 0) {
      errors.circle.push('A Circle Marker Color is required');
      errors.error = true;
    }
  }
  return errors;
};

const validPanel = () => {
  const errors = errorMsgs();
  let panelName = '';
  Object.keys(panels).forEach(key => {
    if (panels[key] === currentPanel) {
      panelName = key;
    }
  });
  if (errors[panelName] && errors[panelName].length > 0) {
    alert(errors[panelName].join('\n'));
    return false;
  }
  return true;
};

const nextPanel = (dia, obj) => {
  let nextPanel;
  const data = dia.getData();
  const next = obj.name === 'next';
  if (currentPanel === panels.style) {
    nextPanel = panels.search;
  }
  if (currentPanel === panels.search) {
    if (next) {
      nextPanel = data.search_location !== 'none' ? panels.geoclient : panels.data;
    } else {
      nextPanel = panels.style;
    }
  }
  if (currentPanel === panels.geoclient) {
    nextPanel = next ? panels.data : panels.search;
  }
  if (currentPanel === panels.data) {
    if (next) {
      if (data.data_source === 'csv') {
        nextPanel = panels.csv;
      } else if (data.data_source === 'socrata') {
        nextPanel = panels.socrata;
      } else {
        nextPanel = panels.start;
      }
    } else {
      nextPanel = panels.search;
    }
  }
  if (currentPanel === panels.csv) {
    nextPanel = next ? panels.presentation : panels.data;
  }
  if (currentPanel === panels.socrata) {
    nextPanel = next ? panels.columns : panels.data;
  }
  if (currentPanel === panels.columns) {
    nextPanel = next ? panels.presentation : panels.socrata;
  }
  if (currentPanel === panels.presentation) {
    if (next) {
      nextPanel = data.presentation_marker === 'icon' ? panels.icon : panels.circle;
    } else {
      nextPanel = panels.data;
    }
  }
  if (currentPanel === panels.icon || currentPanel === panels.circle) {
    nextPanel = panels.presentation;
  }
  if (currentPanel === panels.start) {
    nextPanel = panels.data;
  }
  return nextPanel;
};

const canSave = (dia) => {
  const errors = errorMsgs();
  if (errors.error) {
    dia.disable('save');
  } else {
    dia.enable('save');
  }
};

const onChange = (dia) => {
  const data = dia.getData();
  Object.keys(data).forEach(key => {
    diaData[key] = data[key];
  });
  canSave(dia);
};

const onAction = (dia, obj) => {
  if (validPanel() || obj.name === 'previous') {
    currentPanel = nextPanel(dia, obj);
    if (currentPanel === panels.columns) {
      showColumns(diaData, panel => {
        panel.initialData = diaData;
        dia.redial(panel);
      });
    } else {
      currentPanel.initialData = diaData;
      console.warn(currentPanel);
      dia.redial(currentPanel);
      }
    if (currentPanel === panels.start) {
      dia.disable('next');
    } else {
      dia.enable('next');
    }
    if (currentPanel === panels.style) {
      dia.disable('previous');
    } else {
      dia.enable('previous');
    }
  }
  canSave(dia);
  if (currentPanel === panels.circle) {
    colorHack = setInterval(() => {
      onChange(dia);
    }, 100);
  } else {
    clearInterval(colorHack);
  }
};

const onSubmit = (dia) => {
  const mapHtmlElements = DataToHtml.htmlFromData(editor, diaData);
  UpdateHtml.updateHtml(editor, mapHtmlElements);
  dia.disable('previous');
  dia.disable('next');
  dia.disable('cancel');
  dia.disable('save');
  setTimeout(() => {
    editor.windowManager.close();
  }, 1000);
  clearInterval(colorHack);
};

const panelAddOns = {
  buttons: buttons.buttons,
  onChange: onChange,
  onAction: onAction,
  onSubmit: onSubmit
};

panels.panels.forEach(panel => {
  Object.assign(panel, panelAddOns);
});

export default {
  showDialog: (ed : Editor) => {
    editor = ed;
    currentPanel = panels.style;
    diaData = {
      instance: '',
      style_style: 'min',
      search_location: 'none',
      geoclient_url: GEOCLIENT_URL,
      geoclient_app: '',
      geoclient_key: '',
      data_source: 'none',
      csv_url: '',
      socrata_url: SOCRATA_URL,
      socrata_resource: '',
      presentation_name: '',
      presentation_list: '',
      presentation_marker: 'circle',
      circle_color: '#0000ff',
      icon_url: '',
      start_at: '',
      ID: '',
      X: '',
      Y: '',
      LNG: '',
      LAT: '',
      NAME: '',
      ADDR1: '',
      ADDR2: '',
      CITY: '',
      BORO: '',
      STATE: '',
      ZIP: '',
      PHONE: '',
      EMAIL: '',
      WEBSITE: '',
      DETAIL: ''
    };
    editor.windowManager.open(panels.style);
  }
};
