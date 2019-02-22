const previous = {
  type: 'custom',
  name: 'previous',
  text: 'Previous',
  disabled: true
};
const next = {
  type: 'custom',
  name: 'next',
  text: 'Next'
};
const cancel = {
  type: 'cancel',
  name: 'cancel',
  text: 'Cancel'
};
const save = {
  type: 'submit',
  name: 'save',
  text: 'Save'
};

export default {
  previous: previous,
  next: next,
  cancel: cancel,
  save: save,
  buttons: [
    previous,
    next,
    cancel,
    save
  ]
};