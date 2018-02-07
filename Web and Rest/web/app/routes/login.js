import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  authenticator: 'authenticator:custom',
  setupController(controller, model) {
  this._super(controller, model);
  this.controller.loadLogin();
  }
});
