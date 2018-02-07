import Ember from 'ember';

export default Ember.Component.extend({
  assignments: [],
  didInsertElement: function() {
    Ember.Logger.log('assignments component');
    Ember.Logger.log(this.get('assignments'));
  }
});
