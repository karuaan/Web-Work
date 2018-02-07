import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['draggableDropzone'],
  classNameBindings: ['dragClass'],
  dragClass: 'deactivated',

  dragLeave(event) {
    event.preventDefault();
    this.set('drageClass', 'deactivated');
  },

  dragOver(event) {
    event.preventDefault();
    this.set('dragClass', 'activated');
  },

  drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.files;

    this.sendAction('dropped', data);

    this.set('dragClass', 'deactivated');
  }
});
