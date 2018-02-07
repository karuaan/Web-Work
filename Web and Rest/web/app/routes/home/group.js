import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
  members: [],
  setupController: function(controller) {
    controller.set('members', []);
  },
  actions: {
    didTransition: function() {
      Ember.run.scheduleOnce('afterRender', function() {
        Ember.Logger.log('loaded DOM');
      });
    },
    addGroup: function() {
		//window.console.log(this.controller.getMembers());
      this.controller.addMember();
    },
    removeMember(index) {
      var row = document.getElementById(index);
      row.parentNode.removeChild(row);
    },
    createGroup() {
		//window.console.log(this.controller.getMembers());
	//window.console.log(members);
	var restServerURL = 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000';
	//var restServerURL = 'http://localhost:3000';
	var theGroupData = this.controller.onCreateGroup();
	console.log(theGroupData);
	
      var self = this;
     Ember.$.ajax(restServerURL + '/new/group', {
       "type": 'POST', // HTTP method
       "crossDomain":true,
       "dataType": 'json', // type of data expected from the API response
       "data": this.controller.onCreateGroup()
     }).then(function(resolve) {
       // to do list
       // change the response
        //   window.console.log("succes"+resolve['groups']);
           self.transitionTo('home.assign');


       }).then(function(reject){

       });

    }
  }
});
