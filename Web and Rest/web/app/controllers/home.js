import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  userName: null,
  userAdmin: false,
  userCustomer: false,
  actions: {
    invalidateSession: function() {
      this.get('session').invalidate();
      this.transitionToRoute('login');
    }
  }
});
