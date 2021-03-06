import { MutationObserver } from '@ephox/dom-globals';
import UpdateHtml from './UpdateHtml';

let editor;
let doc;

const observer = new MutationObserver(mutationsList => {
  for (const mutation of mutationsList) {
    listenAsNeeded(Array.from(mutation.addedNodes));
    UpdateHtml.removeHtml(editor, Array.from(mutation.removedNodes));
  }
});

const listenAsNeeded = (added) => {
  for (let i = 0; i < added.length; i++) {
    const node : any = added[i];
    const className = node.className || '';
    if (className.indexOf('nyc-map-selectable') > -1) {
      node.addEventListener('click', event => {
        editor.selection.select(node);
        editor.selection.controlSelection.showResizeRect(node);
      });
    }
  }
};

export default {
  observe: ed => {
    editor = ed;
    doc = editor.getDoc();
    observer.observe(
      doc.body, 
      {childList: true, subtree: true}
    );
  }
};
