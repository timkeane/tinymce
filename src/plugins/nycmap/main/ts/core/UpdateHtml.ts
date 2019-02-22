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

const updateContent = (editor, doc, node) => {
  if (node) {
    const existing = doc.getElementById(node.id);
    if (existing !== null) {
      existing.innerHTML = node.innerHTML;
      node.getAttributeNames().forEach(attr => {
        existing.setAttribute(attr, node.getAttribute(attr));
      });
    } else {
      const div = doc.createElement('div');
      if (node) {
        div.appendChild(node);
        editor.insertContent(div.innerHTML);
        const children = doc.getElementById(node.id).children;
        for (var i = 0; i < children.length; i++) {
          if (children.item(i).tagName === 'BR') {
            children.item(i).remove();
          }
        }
      }
    }
  }
};

const updateHtml = (editor : Editor, html : MapHtmlElements) => {
  const doc = editor.getDoc();
  updateHead(editor, html);
  updateContent(editor, doc, html.search);
  updateContent(editor, doc, html.map);
  updateContent(editor, doc, html.list);
  appendToHeadWhenReady(editor, html.script, 'nyc');
};

const updateMapScript = (editor, doc, script) => {
  const win = editor.getWin();
  if (win.jQuery && win.proj4 && win.ol && win.nyc) {
    updateContent(editor, doc, script);
  } else {

    setTimeout(() => {
      updateMapScript(editor, doc, script)      ;
    }, 500);
  }
};

const remove = (node) => {
  if (node) node.remove();
};

const removeHtml = (editor : Editor, html : MapHtmlElements) => {
  html.head.forEach(node => {
    remove(node);
  });
  remove(html.search);
  remove(html.map);
  remove(html.list);
};

export default {
  updateHtml,
  removeHtml
};
