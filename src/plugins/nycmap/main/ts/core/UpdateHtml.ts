import { Editor } from 'tinymce/core/api/Editor';
import { MapHtmlElements } from './DataToHtml';

const updateHead = (editor, html) => {
  const head = html.head;
  head.css.forEach(css => {
    appendToHead(editor.getDoc(), css);
  });
  appendToHeadWhenReady(editor, head.jquery, false);
  appendToHeadWhenReady(editor, head.proj4, 'jQuery');
  appendToHeadWhenReady(editor, head.ol, 'proj4');
  if (head.papa) {
    appendToHeadWhenReady(editor, head.papa, 'ol');
    appendToHeadWhenReady(editor, head.polyfill, 'Papa');  
    appendToHeadWhenReady(editor, head.nyc, 'Papa');
  } else {
    appendToHeadWhenReady(editor, head.polyfill, 'ol');  
    appendToHeadWhenReady(editor, head.nyc, 'ol');
  }
};

const appendToHead = (doc, node) => {
  if (node) {
    const existing = doc.getElementById(node.id);
    if (existing !== null) {
      existing.remove();
    }
    doc.head.appendChild(node);
  }
};

const appendToHeadWhenReady = (editor, node, wait) => {
  if (node) {
    if (wait === false || editor.getWin()[wait] !== undefined) {
      appendToHead(editor.getDoc(), node);
    } else {
      setTimeout(() => {
        appendToHeadWhenReady(editor, node, wait);
      }, 500);
    }
  }
};

const updateContent = (editor, doc, node, map, before) => {
  if (node) {
    const existing = doc.getElementById(node.id);
    if (existing !== null) {
      existing.innerHTML = node.innerHTML;
      node.getAttributeNames().forEach(attr => {
        existing.setAttribute(attr, node.getAttribute(attr));
      });
    } else if (map === null) {
      const div = doc.createElement('div');
      div.appendChild(node);
      editor.insertContent(div.innerHTML);
      const children = doc.getElementById(node.id).children;
      for (var i = 0; i < children.length; i++) {
        if (children.item(i).tagName === 'BR') {
          children.item(i).remove();
        }
      }
    } else {
      map.insertAdjacentElement(before ? 'beforebegin' : 'afterend', node);
    }
  }
};

const updateHtml = (editor : Editor, html : MapHtmlElements) => {
  const doc = editor.getDoc();
  updateHead(editor, html);
  updateContent(editor, doc, html.map, null, null);
  const map = doc.getElementById(html.map.id);
  updateContent(editor, doc, html.search, map, true);
  updateContent(editor, doc, html.list, map, false);
  appendToHeadWhenReady(editor, html.script, 'nyc');
};

const updateMapScript = (editor, doc, script) => {
  const win = editor.getWin();
  if (win.jQuery && win.proj4 && win.ol && win.nyc) {
    updateContent(editor, doc, script, null, null);
  } else {

    setTimeout(() => {
      updateMapScript(editor, doc, script)      ;
    }, 500);
  }
};


const removeHtml = (doc, removed) => {
  for (let i = 0; i < removed.length; i++) {
    const node : any = removed[i];
    const className = node.className || '';
    if (className.indexOf('nyc-map') > -1) {
      mapNodeRemoved(doc, node);
    }
  }
};

const mapNodeRemoved = (doc, node) => {
  const id = node.id;
  if (id && id.indexOf('map-instance-') > -1) {
    remove(doc.getElementsByClassName(id));
  }
  removeAll(doc);
};

const removeAll = (doc) => {
  if (doc.getElementsByClassName('nyc-map-instance').length === 0) {
    remove(doc.getElementsByClassName('nyc-map'));
  }
};

const remove = nodes => {
  const remove = Array.from(nodes);
  for (let i = 0; i < remove.length; i++) {
    const n : any = remove[i];
    console.warn(n);
    n.parentElement.removeChild(n);
  }
};

export default {
  updateHtml,
  removeHtml
};
