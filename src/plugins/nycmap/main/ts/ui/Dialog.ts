import panels from './Panels';
import buttons from './DialogButtons';
import { MapDialogData } from '../core/DataToHtml'
import DataToHtml from '../core/DataToHtml'
import { alert } from '@ephox/dom-globals';
import { Editor } from 'tinymce/core/api/Editor';
import UpdateHtml from '../core/UpdateHtml';

const SOCRATA_URL = 'https://data.cityofnewyork.us';
const GEOCLIENT_URL = 'https://maps.nyc.gov/geoclient/v1';

const mapDialogData : MapDialogData = {
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
let editor;
let currentPanel = panels.style;

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
  if (mapDialogData.search_location !== 'none') {
    if (mapDialogData.geoclient_url.trim().length === 0) {
      errors.geoclient.push('A Geoclient URL is required');
      errors.error = true;
    }
    if (mapDialogData.geoclient_app.trim().length === 0) {
      errors.geoclient.push('A Geoclient App Id is required');
      errors.error = true;
    }
    if (mapDialogData.geoclient_key.trim().length === 0) {
      errors.geoclient.push('A Geoclient App Key is required');
      errors.error = true;
    }
  }
  if (mapDialogData.data_source === 'csv') {
    if (mapDialogData.csv_url.trim().length === 0) {
      errors.csv.push('A CSV URL is required');
      errors.error = true;
    }
  }
  if (mapDialogData.data_source === 'socrata') {
    if (mapDialogData.socrata_url.trim().length === 0) {
      errors.socrata.push('A Socrata URL is required');
      errors.error = true;
    }
    if (mapDialogData.socrata_resource.trim().length === 0) {
      errors.socrata.push('A Socrata Resource Id is required');
      errors.error = true;
    }
    //TODO column validation
  }
  if (mapDialogData.presentation_marker === 'icon') {
    if (mapDialogData.icon_url.trim().length === 0) {
      errors.icon.push('A Marker Icon Url is required');
      errors.error = true;
    }
  }
  if (mapDialogData.presentation_marker === 'circle') {
    if (mapDialogData.circle_color.trim().length === 0) {
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
    mapDialogData[key] = data[key];
  });
  canSave(dia);
};

const onAction = (dia, obj) => {
  if (validPanel() || obj.name === 'previous') {
    currentPanel = nextPanel(dia, obj);
    currentPanel.initialData = mapDialogData;
    dia.redial(currentPanel);
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
    if (currentPanel === panels.columns) {
      //get cols from socrata
    }
  }
  canSave(dia);
};

const onSubmit = (dia) => {
  const mapHtmlElements = DataToHtml.htmlFromData(editor, mapDialogData);
  UpdateHtml.updateHtml(editor, mapHtmlElements);
  dia.disable('previous');
  dia.disable('next');
  dia.disable('cancel');
  dia.disable('save');
  setTimeout(() => {
    editor.windowManager.close();
  }, 1000);
};

panels.panels.forEach(panel => {
  panel.buttons = buttons.buttons;
  panel.onChange = onChange;
  panel.onAction = onAction;
  panel.onSubmit = onSubmit;
});

export default {
  showDialog: (ed : Editor) => {
    editor = ed;
    editor.windowManager.open(panels.style);
  }
}
