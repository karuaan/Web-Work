import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Controller.extend({
  errorMessage: null,
  session: Ember.inject.service('session'),
  authenticator: 'authenticator:custom',
  loadLogin: function() {
    this.set('errorMessage', null);
  },
  actions: {
    authenticate: function() {
      //var restURL = 'http://localhost:3000';
		  var restURL = 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000';
      var self = this;
      Ember.$.ajax(restURL + '/login', {
        "type": 'POST', // HTTP method
        "crossDomain":true,
        "dataType": 'json', // type of data expected from the API response
        "data": { // Begin data payload
          "email" : this.get('identification'),
          "password": this.get('password')
        }
      }).then(function(resolve) {
        // to do list
        // change the response
        var status = resolve.status;
        window.console.log(status);
        if (status == "success") {
          //store user data in session
          var userData = resolve.user_data;
          window.console.log(userData);
          self.get('session').set('userInfo', userData);
          self.transitionToRoute('home.assign');
        } else {
          // display error
          window.console.log(resolve.status);
          window.console.log(resolve.message);
        }
      }).then(function(reject){
      });
    }
  }
});
