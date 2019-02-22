import { Editor } from 'tinymce/core/api/Editor';

const NYC_LIB_VER = 'v1.2.37';
const NYC_LIB_URL = `https://maps.nyc.gov/nyc-lib/${NYC_LIB_VER}`;

const NYC_LIB_MIN_CSS = {id: 'nyc-map-min-css', class: 'nyc-map-dependency', rel: 'stylesheet', href: `${NYC_LIB_URL}/css/nyc-basic-lib.css`};
const NYC_LIB_FULL_CSS = {id: 'nyc-map-full-css', class: 'nyc-map-dependency', rel: 'stylesheet', href: `${NYC_LIB_URL}/css/nyc-ol-lib.css`};
const FONT_AWESOME_CSS = {id: 'nyc-map-fa', class: 'nyc-map-dependency', rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.7.1/css/all.css'};
const JQUERY_JS = {id: 'nyc-map-jq', class: 'nyc-map-dependency', src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'};
const PROJ4_JS = {id: 'nyc-map-proj4', class: 'nyc-map-dependency', src: 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.15/proj4.js'};
const OL_JS = {id: 'nyc-map-ol', class: 'nyc-map-dependency', src: 'https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.3.0/build/ol.js'};
const PAPA_JS = {id: 'nyc-map-papa', class: 'nyc-map-dependency', src: 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.4.0/papaparse.min.js'},
const POLYFILL_JS = {id: 'nyc-map-polyfill', class: 'nyc-map-dependency', src:`${NYC_LIB_URL}/js/babel-polyfill.js`};
const NYC_LIB_JS = {id: 'nyc-map-lib', class: 'nyc-map-dependency', src:`${NYC_LIB_URL}/js/nyc-ol-lib.js`}

export interface MapDialogData {
  instance: string;
  style_style: string;
  search_location: string;
  geoclient_url: string;
  geoclient_app: string;
  geoclient_key: string;
  data_source: string;
  csv_url: string;
  socrata_url: string;
  socrata_resource: string;
  presentation_name: string,
  presentation_list: string;
  presentation_marker: string;
  circle_color: string;
  icon_url: string;
  start_at: string;
  ID: string;
  NAME: string;
  ADDR1: string;
  ADDR2: string;
  CITY: string;
  BORO: string;
  STATE: string;
  ZIP: string;
  PHONE: string;
  EMAIL: string;
  WEBSITE: string;
  DETAIL: string;
};

export interface MapHtmlElements {
  head: any;
  search: any;
  map: any;
  list: any;
  script: any;
};

const createHtmlElement = (doc, type, obj) => {
  const element = doc.createElement(type);
  Object.keys(obj).forEach(attr => {
    element.setAttribute(attr, obj[attr]);
  });
  return element;
};

const headElements = (args) => {
  const win = args.win;
  const doc = args.doc;
  const data = args.data;
  const elements : any = {css: []};
  if (win.jQuery === undefined) {
    elements.jquery = createHtmlElement(doc, 'script', JQUERY_JS);
  }
  if (doc.getElementById(PROJ4_JS.id) === null) { 
    elements.proj4 = createHtmlElement(doc, 'script', PROJ4_JS);
  }
  if (doc.getElementById(OL_JS.id) === null) { 
    elements.ol = createHtmlElement(doc, 'script', OL_JS);
  }
  if (data.data_source !== 'none') {
    if (doc.getElementById(PAPA_JS.id) === null) { 
      elements.papa = createHtmlElement(doc, 'script', PAPA_JS);
    }
  }
  if (doc.getElementById(POLYFILL_JS.id) === null) { 
    elements.polyfill = createHtmlElement(doc, 'script', POLYFILL_JS);
  }
  if (doc.getElementById(NYC_LIB_JS.id) === null) { 
    elements.nyc = createHtmlElement(doc, 'script', NYC_LIB_JS);
  }
  if (doc.getElementById(FONT_AWESOME_CSS.id) === null) {
    elements.css.push(createHtmlElement(doc, 'link', FONT_AWESOME_CSS));
  }
  if (data.style_style === 'min') {
    if (doc.getElementById(NYC_LIB_MIN_CSS.id) === null) {
      elements.css.push(createHtmlElement(doc, 'link', NYC_LIB_MIN_CSS));
    }
  } else {
    if (doc.getElementById(NYC_LIB_FULL_CSS.id) === null) {
      elements.css.push(createHtmlElement(doc, 'link', NYC_LIB_FULL_CSS));
    }
  }
  return elements;
};

const searchElement = (args) => {
  if (args.data.search_location === 'above') {
    return createHtmlElement(args.doc, 'input', {
      id: `nyc-map-search-${args.instance}`,
      class: `nyc-map-search nyc-map-instance-${args.instance}`
    });
  }
};

const mapElement = (args) => {
  return createHtmlElement(args.doc, 'div', {
    id: `nyc-map-${args.instance}`,
    class: `nyc-map-instance nyc-map-instance-${args.instance}`
  });
};

const listElement = (args) => {
  if (args.data.presentation_list === 'yes') {
    return createHtmlElement(args.doc, 'div', {
      id: `nyc-map-list-${args.instance}`,
      class: `nyc-map-list nyc-map-instance-${args.instance}`
    });
  }
};

const socrataSql = (data : MapDialogData) => {
  return '';
};

const dataUrl = (data : MapDialogData) => {
  if (data.data_source === 'csv') {
    return data.csv_url;
  }
  const sql = socrataSql(data);
  return `${data.socrata_url}/resource/${data.socrata_resource}.json?${sql}`;
};

const searchOtions = (args: any, mapOptions : any) => {
  const data = args.data;
  const instance = args.instance;
  if (data.search_location !== 'none') {
    mapOptions.geoclientUrl = `${data.geoclient_url}/search.json?app_id=${data.geoclient_app}&app_key=${data.geoclient_key}`;
    if (data.search_location === 'above') {
      mapOptions.searchTarget = `#nyc-map-search-${instance}`;
    }
  }
};

const dataOtions = (args: any, mapOptions : any) => {
  const data = args.data;
  const instance = args.instance;
  if (data.data_source !== 'none') {
    mapOptions.facilityUrl = dataUrl(data);
    if (data.presentation_list === 'yes') {
      mapOptions.searchTarget = `#nyc-map-list-${instance}`;
    }
    if (data.presentation_name.trim() !== '') {
      mapOptions.facilityType = data.presentation_name;
    }
    if (data.presentation_marker === 'icon') {
      mapOptions.mapMarkerUrl = data.icon_url;
    } else {
      mapOptions.mapMarkerColor = data.circle_color;
    }
  }
};

const mapOptions = (args) => {
  const mapOptions : any = {
    mapTarget: `#nyc-map-${args.instance}`
  };
  searchOtions(args, mapOptions);
  dataOtions(args, mapOptions);
  return JSON.stringify(mapOptions, null, 2);
};

const scriptElement = (args) => {
  const instance = args.instance;
  const script = createHtmlElement(args.doc, 'script', {
    id: `nyc-map-script-${instance}`,
    class: `nyc-map-script nyc-map-instance-${instance}`
  });
  const options = mapOptions(args);
  script.innerHTML = `
    $(document).ready(function() {
      var nycMap${instance} = new nyc.ol.FrameworkMap(
        ${options}
      );
    });
  `;
  return script;
};

const getInstanceId = (doc, data) => {
  if (data.instance !== '') {
    return data.instance;
  }
  return doc.getElementsByClassName('nyc-map-instance').length;
};

const htmlFromData = (editor : Editor, mapDialogData : MapDialogData) => {
  const args = {
    win: editor.getWin(),
    doc: editor.getDoc(),
    instance: getInstanceId(editor.getDoc(), mapDialogData),
    data: mapDialogData
  };
  const html : MapHtmlElements = {
    head: headElements(args),
    search: searchElement(args),
    map: mapElement(args),
    list: listElement(args),
    script: scriptElement(args)
  };
  return html;
};

export default {
  htmlFromData
};
