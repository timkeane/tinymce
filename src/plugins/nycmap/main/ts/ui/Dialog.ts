import nycPanels from './panels.js';
import nycButtons from './dialogButtons.js';
import { alert } from '@ephox/dom-globals';

const config = {
  style_style: '',
  search_location: 'none',
  geoclient_url: '',
  geoclient_app: '',
  geoclient_key: '',
  data_source: 'none',
  csv_url: '',
  socrata_url: '',
  socrata_resource: '',
  presentation_marker: 'circle',
  circle_color: 'blue',
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
let currentPanel = nycPanels.style;

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
  if (config.search_location !== 'none') {
    if (config.geoclient_url.trim().length === 0) {
      errors.geoclient.push('A Geoclient URL is required');
      errors.error = true;
    }
    if (config.geoclient_app.trim().length === 0) {
      errors.geoclient.push('A Geoclient App Id is required');
      errors.error = true;
    }
    if (config.geoclient_key.trim().length === 0) {
      errors.geoclient.push('A Geoclient App Key is required');
      errors.error = true;
    }
  }
  if (config.data_source === 'csv') {
    if (config.csv_url.trim().length === 0) {
      errors.csv.push('A CSV URL is required');
      errors.error = true;
    }
  }
  if (config.data_source === 'socrata') {
    if (config.socrata_url.trim().length === 0) {
      errors.socrata.push('A Socrata URL is required');
      errors.error = true;
    }
    if (config.socrata_resource.trim().length === 0) {
      errors.socrata.push('A Socrata Resource Id is required');
      errors.error = true;
    }
    //TODO column validation
  }
  if (config.presentation_marker === 'icon') {
    if (config.icon_url.trim().length === 0) {
      errors.icon.push('A Marker Icon Url is required');
      errors.error = true;
    }
  }
  if (config.presentation_marker === 'circle') {
    if (config.circle_color.trim().length === 0) {
      errors.circle.push('A Circle Marker Color is required');
      errors.error = true;
    }
  }
  return errors;
};

const validPanel = () => {
  const errors = errorMsgs();
  let panelName = '';
  Object.keys(nycPanels).forEach(key => {
    if (nycPanels[key] === currentPanel) {
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
  if (currentPanel === nycPanels.style) {
    nextPanel = nycPanels.search;
  }
  if (currentPanel === nycPanels.search) {
    if (next) {
      nextPanel = data.search_location !== 'none' ? nycPanels.geoclient : nycPanels.data;
    } else {
      nextPanel = nycPanels.style;
    }
  }
  if (currentPanel === nycPanels.geoclient) {
    nextPanel = next ? nycPanels.data : nycPanels.search;
  }
  if (currentPanel === nycPanels.data) {
    if (next) {
      if (data.data_source === 'csv') {
        nextPanel = nycPanels.csv;
      } else if (data.data_source === 'socrata') {
        nextPanel = nycPanels.socrata;
      } else {
        nextPanel = nycPanels.start;
      }
    } else {
      nextPanel = nycPanels.search;
    }
  }
  if (currentPanel === nycPanels.csv) {
    nextPanel = next ? nycPanels.presentation : nycPanels.data;
  }
  if (currentPanel === nycPanels.socrata) {
    nextPanel = next ? nycPanels.columns : nycPanels.data;
  }
  if (currentPanel === nycPanels.columns) {
    nextPanel = next ? nycPanels.presentation : nycPanels.socrata;
  }
  if (currentPanel === nycPanels.presentation) {
    if (next) {
      nextPanel = data.presentation_marker === 'icon' ? nycPanels.icon : nycPanels.circle;
    } else {
      nextPanel = nycPanels.data;
    }
  }
  if (currentPanel === nycPanels.icon || currentPanel === nycPanels.circle) {
    nextPanel = nycPanels.presentation;
  }
  if (currentPanel === nycPanels.start) {
    nextPanel = nycPanels.data;
  }
  return nextPanel;
};

const update = (data) => {
  Object.keys(data).forEach(key => {
    config[key] = data[key];
  });
  console.warn(config);
};

const canSave = (dia) => {
  const errors = errorMsgs();
  if (errors.error) {
    dia.disable('save');
  } else {
    dia.enable('save');
  }
};

const onChange = (dia, obj) => {
  console.warn(obj);
  update(dia.getData());
  canSave(dia);
};

const onAction = (dia, obj) => {
  if (validPanel() || obj.name === 'previous') {
    currentPanel = nextPanel(dia, obj);
    currentPanel.initialData = config;
    dia.redial(currentPanel);
    if (currentPanel === nycPanels.start) {
      dia.disable('next');
    } else {
      dia.enable('next');
    }
    if (currentPanel === nycPanels.style) {
      dia.disable('previous');
    } else {
      dia.enable('previous');
    }
    if (currentPanel === nycPanels.columns) {
      //get cols from socrata
    }
  }
  canSave(dia);
};

const onSubmit = (dia, obj) => {

};

nycPanels.panels.forEach(panel => {
  panel.buttons = nycButtons.buttons;
  panel.onChange = onChange;
  panel.onAction = onAction;
  panel.onSubmit = onSubmit;
});

export default {
  showDialog: (ed) => {
    editor = ed;
    editor.windowManager.open(nycPanels.style);
  }
}
