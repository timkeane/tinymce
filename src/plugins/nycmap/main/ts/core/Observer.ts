import { MutationObserver } from '@ephox/dom-globals';

let editor;
let doc;

const observer = new MutationObserver(mutationsList => {
  for(const mutation of mutationsList) {
    listenAsNeeded(Array.from(mutation.addedNodes));
    removeAsNeeded(Array.from(mutation.removedNodes));
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

const removeAsNeeded = (removed) => {
  for (let i = 0; i < removed.length; i++) {
    const node : any = removed[i];
    const className = node.className || '';
    if (className.indexOf('nyc-map') > -1) {
      mapNodeRemoved(node);
    }
  }
};

const mapNodeRemoved = (node) => {
  const id = node.id;
  if (id && id.indexOf('map-instance-') > -1) {
    remove(doc.getElementsByClassName(id));
  }
  removeAll();
};

const removeAll = () => {
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
  observe: ed => {
    editor = ed;
    doc = editor.getDoc();
    observer.observe(
      doc.body, 
      {childList: true, subtree: true}
    );
  }
};
