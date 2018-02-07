import Ember from 'ember';
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

//export default Ember.Route.extend(AuthenticatedRouteMixin, {
export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  //authenticator: 'authenticator:custom',
  /*
  beforeModel: function(transition) {
    Ember.Logger.log('before model home');
    Ember.Logger.log(this.get('session.isAuthenticated'));
    if(!this.get('session.isAuthenticated')) {
      this.transitionTo('login');
    } else {
      this.controllerFor('home').set('userName', sessionStorage.userName);
      var type = this.get('session').get('session').content.authenticated.sessionType;
      this.controllerFor('home').set('userCustomer', false);
      this.controllerFor('home').set('userAdmin', false);
      if(type === 'admin') {
        this.controllerFor('home').set('userAdmin', true);
      } else if (type === 'customer') {
        this.controllerFor('home').set('userCustomer', true);
      }
    }
  }
  */
});
