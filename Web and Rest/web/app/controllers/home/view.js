import Ember from 'ember';

export default Ember.Controller.extend({
  display: function() {
    //return this.get('file');
    return "/assets/pdfs/Foreword.pdf";
  }.property('file'),
});
