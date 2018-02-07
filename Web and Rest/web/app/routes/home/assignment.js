import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  setupController: function(controller, model) {
    console.log("get current book id");
    console.log(this.get('session').get('addAssignmentBookId'));

    //var restServerURL = "http://localhost:3000";
	var restServerURL = 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000';
    var lessons = [];
    var self = this;


    // Get list of lessons using bookId

    /*
    var bookId = this.get('session').get('addAssignmentBookId');
    if(bookId !== null && bookId !== undefined) {

      Ember.$.ajax(restServerURL + '/getbook', {
        "type": 'GET',
        "crossDomain": true,
        "data": {
          "book_id": bookId
        }
      }).then(function(resolve) {
        // save book data
        controller.set('bookPDF', resolve);
      });

      Ember.$.ajax(restServerURL + '/getlessons', {
        "type": 'POST', // HTTP method
        "crossDomain":true,
        "dataType": 'json', // type of data expected from the API response
        "data": { // Begin data payload
          "book_id" : bookId
        }
      }).then(function(resolve) {
        for(var i=0;i<resolve.length;i++) {
          var lesson={};
          lesson["name"] = resolve[i]["NAME"];
	        lesson["id"] = resolve[i]["ID"];
          lesson["start"] = resolve[i]["START"];
          lesson["end"] = resolve[i]["END"];
				  lessons.push(lesson);
      }
      controller.set('lessons', lessons);
    }).then(function(reject){
    });
    */
  },
  actions: {
    toConsole: function() {
      this.transitionTo('home.assign');
    },
    createLesson: function() {
      this.transitionTo('home.parse');
    },
	   createAssignment: function() {

		     console.log("");
         //this.transitionTo('home.parse');
    }
  }
});
