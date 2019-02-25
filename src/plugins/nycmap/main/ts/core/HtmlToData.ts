import { MapDialogData } from './DataToHtml';
import Color from 'tinymce/core/api/util/Color'

const SOCRATA_URL = 'https://data.cityofnewyork.us';
const GEOCLIENT_URL = 'https://maps.nyc.gov/geoclient/v1';

const regExp = RegExp(/(?<=FrameworkMap\()(.*?)(?=\))/s);

const defaultData = () => {
  const diaData : MapDialogData = {
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
  return diaData;
};

const dataFromHtml = function (editor) {
  return diaDataFromScript(editor);
};

const diaDataFromScript = (editor) => {
  const diaData = defaultData();
  const script = getScript(editor);
  if (script) {
    const json = regExp.exec(script.innerText);
    if (json) {
      const options = JSON.parse(json[0].trim())
      return diaDataFromOptions(diaData, options);
    }
  }
  return diaData;
};

const urlParams = (url) => {
  const urlParams : any = {};
  const split = url.split('?');
  urlParams.url = split[0];
  if (split.length > 1) {
    split[1].split('&').forEach(param => {
      const nameVal = param.split('=');
      urlParams[nameVal[0]] = decodeURIComponent(nameVal[1]);
    });
    }
  return urlParams;
};

const columnsFromOptions = (diaData, select) => {
  const columns = select.split(',');
  columns.forEach(col => {
    const aliased = col.split(' as ');
    diaData[aliased[1]] = aliased[0];
  });
};

const pathParts = (url) => {
  const split = url.split('://');
  const parts = split[1].split('/');
  parts[0] = `${split[0]}://${parts[0]}`;
  return parts;
};

const dataFromOptions = (diaData, options) => {
  if (options.facilityUrl) {
    const params = urlParams(options.facilityUrl);
    diaData.presentation_name = options.facilityType || '';
    if (params['$select']) {
      const path = pathParts(params.url);
      diaData.data_source = 'socrata';
      diaData.socrata_url = path[0];
      diaData.socrata_resource = path[2].split('.')[0];
      columnsFromOptions(diaData, params['$select']);
    } else {
      diaData.data_source = 'csv';
      diaData.csv_url = options.facilityUrl;
    }
  }
};

const mapMarkerFromOptions = (diaData, options) => {
  if (options.mapMarkerUrl) {
    diaData.presentation_marker = 'icon';
    diaData.icon_url = options.mapMarkerUrl;
  } else if (options.mapMarkerColor) {
    const rgb = options.mapMarkerColor;
    diaData.presentation_marker = 'circle';

    console.warn(`rgb(${rgb.join(',')})`);
    console.warn(Color(''));
    console.warn(Color('').parse);
    console.warn(Color('').parse(`rgb(${rgb.join(',')})`).toHex());
    
    diaData.circle_color = Color('').parse(`rgb(${rgb.join(',')})`).toHex();
  }
};

const searchFromOptions = (diaData, options) => {
  if (options.geoclientUrl) {
    const params = urlParams(options.geoclientUrl);
    diaData.geoclient_url = params.url.replace(/\/search\.json/, '');
    diaData.geoclient_app = params.app_id;
    diaData.geoclient_key = params.app_key;
    diaData.search_location = options.searchTarget ? 'above' : 'within';
  }
};

const listFromOptions = (diaData, options) => {
  if (options.listTarget) {
    diaData.presentation_list = 'yes';
  }
};

const startFromOptions = (diaData, options) => {
  if (options.startAt) {
    diaData.start_at = options.startAt;
  }
};

const diaDataFromOptions = (diaData, options) => {
  searchFromOptions(diaData, options);
  dataFromOptions(diaData, options);
  listFromOptions(diaData, options);
  mapMarkerFromOptions(diaData, options);
  startFromOptions(diaData, options);
  return diaData;
};

const getInstance = (node) => {
  let id;
  const className = node.className || '';
  className.split(' ').forEach(css => {
    if (css.indexOf('nyc-map-instance-') === 0) {
      id = css;
    }
  });
  return id ? id.split('-')[3] : '';
};

const getScript = (editor) => {
  const id = getInstance(editor.selection.getNode());
  if (id !== '') {
    return editor.getDoc().getElementById(`nyc-map-script-${id}`);
  }
};

export default {
  dataFromHtml
};