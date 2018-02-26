import Ember from 'ember';
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  assignments: [],
  groups: [],
  view: null,
  employees: [],
  selected: 0,
  refreshGroups:{
	  refreshModel: true
  },
  model: function(params) {
		window.console.log("My params")
		window.console.log(params);
  },
  setupController: function(controller, model) {
		//var restServerURL = "http://localhost:3000";

    this._super(controller, model);
		var restServerURL = 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000';
    console.log('new2 update');
    window.console.log("resolve2222");
    var groups = [];
    var self = this;
	var admin_id = 3;
	var groupId = 1;
	if (this.get('session').get('userData') === undefined){
		admin_id = 3
	}
	else{
		admin_id = this.get('session').get('userData');
	}
    Ember.$.ajax(restServerURL + '/getgroups', {
    	"type": 'POST', // HTTP method
      "crossDomain":true,
      "dataType": 'json', // type of data expected from the API response
      "data": { // Begin data payload
        "admin_id" : admin_id // nilesh commnet - change this id with user ud
      }
    }).then(function(resolve) {
      window.console.log(resolve.length);
      //window.console.log(controller.get("groups"));
      //groups = self.get("groups");
      for(var i=0;i<resolve.length;i++) {
        var group={};
        group["name"] = resolve[i]["NAME"];
				window.console.log(resolve[i]["NAME"]);
        group["id"] = resolve[i]["ID"];
				window.console.log(resolve[i]["ID"]);
        groups.push(group);
      }
	  console.log("^^^^")
	  console.log(groups)
      controller.set('groups', groups);
		controller.set('groupId', groups[0]["id"]);
		groupId = groups[0]["id"];
    }).then(function(reject){
    });

    var assignments = [];
    Ember.$.ajax(restServerURL + '/getassignments', {
      "type": 'POST', // HTTP method
      "crossDomain":true,
      "dataType": 'json', // type of data expected from the API response
      "data": { // Begin data payload
        "admin_id" : admin_id, // nilesh commnet - change this id with user ud
		"group_id" : controller.get('groupId')
      }
    }).then(function(resolve) {
      window.console.log(resolve.length);
      //window.console.log(controller.get("groups"));
      //groups = self.get("groups");
      for(var i=0;i<resolve.length;i++) {
        var assignment={};
        assignment["name"] = resolve[i]["NAME"];
        assignment["id"] = resolve[i]["ID"];
        assignment["dueDate"] = resolve[i]["DUE_DATE"];
        assignment["startDate"] = resolve[i]["START_DATE"];
        assignments.push(assignment);
      }
	  this.assignments = assignments;
      controller.set('assignments', assignments);
    }).then(function(reject) {
    });

    /* We need to get a list of books available for this admin */
    /*
    var books = [];
    Ember.$.ajax(restServerURL + '/getbooks', {
      "type": "GET",
      "crossDomain": true,
      "dataType": 'json',
      "data": {
        "admin_id": admin_id,
        "group_id": this.get('groupId')
      }
    }).then(function(resolve) {
      window.console.log(resolve);
      for(var i = 0; i < resolve.length; i++) {
        console.log("iterate through books id");
        var book = {};
        book["name"] = resolve[i]["NAME"];
        book["id"] = resolve[i]["ID"];
        books.push(book);
      }
      controller.set('books', books);
      // Set which is the current selected book
      if(books.length > 0) {
        controller.set('selectedBook', books[0]);
      }
      this.get('session').set('addAssignmentBookId', books[0].id);
    });
    */

    /*
    assignments.push({
      'id': 0,
      'name': 'Assignment 1',
      'date': '10/12/2017',
      'files': [{
        'id': 1,
        'name': 'Lesson 1',
        'completion': 40
      }],
      'totalCompletion': 40
    });
    assignments.push({
      'id': 1,
      'name': 'Assignment 2',
      'date': '10/13/2017',
      'files': [{
        'id': 2,
        'name': 'Lesson 2',
        'completion': 50
      }, {
        'id': 3,
        'name': 'Supplement',
        'completion': 100
      }],
      'totalCompletion': 75,
    });
    assignments.push({
      'id': 2,
      'name': 'Assignment 3',
      'date': '10/14/2017',
      'files': [{
        'id': 3,
        'name': 'Lesson 3',
        'completion': 60
      }],
      'totalCompletion': 60,
    });
    */

    var employees = [];
    Ember.$.ajax(restServerURL + '/getemployees', {
      "type": 'POST', // HTTP method
      "crossDomain":true,
      "dataType": 'json', // type of data expected from the API response
      "data": { // Begin data payload
        "group_id" : controller.get('groupId') // nilesh commnet - change this id with persisted groupID
      }
    }).then(function(resolve) {
      window.console.log(resolve.length);
      //window.console.log(controller.get("groups"));
      //groups = self.get("groups");
      for(var i=0;i<resolve.length;i++) {
        var employee={};
        employee["name"] = resolve[i]["FIRST_NAME"] + " " + resolve[i]["LAST_NAME"];
        employee["id"] = resolve[i]["ID"];
        employee["mail"] = resolve[i]["EMAIL"];
        employee["status"] = resolve[i]["STATUS"];
        employee["progress"] = 0;
        employees.push(employee);
      }
      controller.set('employees', employees);
	  Ember.$.ajax(restServerURL + '/getstatus', {
				  "type": 'POST', // HTTP method
				  "crossDomain":true,
				  "dataType": 'json', // type of data expected from the API response
				  "data": { // Begin data payload
					"assignment_id" : assignments[0]["id"], // nilesh commnet - change this id with user ud
					"group_id" : groupId
				  }
				}).then(function(resolve) {
				  //window.console.log(resolve.length);
				  //window.console.log(controller.get("groups"));
				  //groups = self.get("groups");
				  console.log("||||||||||||||||");
				  console.log(resolve['incomplete'].length)
				  console.log(this.employees.length)
				  console.log("||||||||||||||||");
				  var k = employees.length
				  for(var i = 0; i < k; ++i ){
					  console.log(i);
					  
					  if(resolve['incomplete'].includes(employees[i]['id'])){
						  console.log('A');
						  this.employees[i] = {'id': this.employees[i]['id'],'name': this.employees[i]['name'],'mail': this.employees[i]['mail'],'status': 'pending'};
					  }
					  else{
							console.log('B');
							console.log(this.employees[i]);
							console.log(this.employees[i]['status']);
						  this.employees[i] = {'id': this.employees[i]['id'],'name': this.employees[i]['name'],'mail': this.employees[i]['mail'],'status': 'complete'};
						  console.log('B');
					  }
					  console.log(this.employees.length);
				  }
				  controller.set('employees', employees);
				   //self.transitionToRoute('home.assign');

				}).then(function(reject){
				});
    }).then(function(reject){
    });

    /*
    employees.push({
      'name': 'John Doe',
      'mail': '128@gmail.com',
      'status': null,
      'progress': [{
        'id': 0,
        'status': 'completed',
        'completion': [{
          'id': 1,
          'name': 'Lesson 1',
          'status': 'completed'
        }]
      }, {
        'id': 1,
        'status': 'pending',
        'completion': [{
          'id': 2,
          'name': 'Lesson 2',
          'status': 'pending'
        }, {
          'id': 3,
          'name': 'Supplement',
          'status': 'completed'
        }]
      }, {
        'id': 2,
        'status': 'overdue',
        'completion': [{
          'id': 4,
          'name': 'Lesson 3',
          'status': 'overdue',
        }]
      }]
    });
    employees.push({
      'name': 'Jane Doe',
      'mail': 'Jane1@gmail.com',
      'status': null,
      'progress': [{
        'id': 0,
        'status': 'overdue',
        'completion': [{
          'id': 1,
          'name': 'Lesson 1',
          'status': 'pending'
        }]
      }, {
        'id': 1,
        'status': 'completed',
        'completion': [{
          'id': 2,
          'name': 'Lesson 2',
          'status': 'completed'
        }, {
          'id': 3,
          'name': 'Supplement',
          'status': 'completed'
        }]
      }, {
        'id': 2,
        'status': 'pending',
        'completion': [{
          'id': 4,
          'name': 'Lesson 3',
          'status': 'overdue',
        }]
      }]
    });
    employees.push({
      'name': 'Jimmy Doe',
      'mail': '356@gmail.com',
      'status': null,
      'progress': [{
        'id': 0,
        'status': 'pending',
        'completion': [{
          'id': 1,
          'name': 'Lesson 1',
          'status': 'overdue'
        }]
      }, {
        'id': 1,
        'status': 'overdue',
        'completion': [{
          'id': 2,
          'name': 'Lesson 2',
          'status': 'overdue'
        }, {
          'id': 3,
          'name': 'Supplement',
          'status': 'pending'
        }]
      }, {
        'id': 2,
        'status': 'completed',
        'completion': [{
          'id': 4,
          'name': 'Lesson 3',
          'status': 'complete',
        }]
      }]
    });
    //this.set('groups', groups);
    this.set('assignments', assignments);
    this.set('employees', employees);
    this.set('view', assignments[0])
  //  controller.set('groups', groups);
    controller.set('assignments', assignments);
    controller.set('employees', employees);
    controller.set('view', assignments[0]);


    var employees = this.get('employees');
    var assignment = this.get('assignments')[0];
    this.set('selected', 0);
    this.controller.set('selected', 0);

    for(let i = 0; i < employees.length; i++) {
      for(let j = 0; j < employees[i].progress.length; j++) {
        if(employees[i].progress[j].id === assignment.id) {
          Ember.set(employees[i], 'status', employees[i].progress[j].status);
        }
      }
    }
    */
  },
  actions: {
    createGroup: function() {
      this.transitionTo('home.group');
    },
    selectAssignment: function(index) {
		console.log(index);
		console.log(assignments[index]);
      var employees = this.get('employees');
      var assignment = this.get('assignments')[index];
      this.set('selected', index);
      this.set('view', this.get('assignments')[index]);
      this.controller.set('selected', index)
      this.controller.set('view', this.get('assignments')[index]);
      for(let i = 0; i < employees.length; i++) {
        for(let j = 0; j < employees[i].progress.length; j++) {
          if(employees[i].progress[j].id === assignment.id) {
            Ember.set(employees[i], 'status', employees[i].progress[j].status);
          }
        }
      }
    },
    addDialog: function() {
      document.getElementById('add-member').style.display = 'block';
      document.getElementById('cs-fog').style.display = 'block';
    },
    addCancel: function() {
      document.getElementById('add-member').style.display = 'none';
      document.getElementById('cs-fog').style.display = 'none';
    },
    addConfirm: function() {
		var restServerURL = 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000';
      var progress = [];
      for(let i = 0; i < this.get('assignments').length; i++) {
        Ember.Logger.log(this.get('assignments')[i].id);
        var stat = {
          'id': this.get('assignments')[i].id,
          'status': 'pending'
        }
        progress.push(stat);
      }

	  window.console.log(document.getElementById("add-mail").value);
		console.log("&&&&");
		console.log(this.controller.get('groupId'));
		console.log(this.get('assignments'));
		console.log(this.controller.get('assignments'));
		let myController = this.controller;
	  Ember.$.ajax('http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/addToGroupEmail', {
       "type": 'POST', // HTTP method
       "crossDomain":true,
       "dataType": 'json', // type of data expected from the API response
       "data": {'user_email': document.getElementById("add-mail").value,
				'group_id' : this.controller.get('groupId')
				}
     }).then(function(resolve) {
			Ember.$.ajax(restServerURL + '/getstatus', {
				  "type": 'POST', // HTTP method
				  "crossDomain":true,
				  "dataType": 'json', // type of data expected from the API response
				  "data": { // Begin data payload
					"assignment_id" : myController.get('assignments')[0]["id"], // nilesh commnet - change this id with user ud
					"group_id" : myController.get('groupId')
				  }
				}).then(function(resolve) {
				  //window.console.log(resolve.length);
				  //window.console.log(controller.get("groups"));
				  //groups = self.get("groups");
				  console.log("||||||||||||||||");
				  console.log(resolve['incomplete'].length)
				  console.log(employees.length)
				  console.log("||||||||||||||||");
				  var k = employees.length
				  for(var i = 0; i < k; ++i ){
					  console.log(i);

					  if(resolve['incomplete'].includes(employees[i]['id'])){
						  console.log('A');
						  employees[i] = {'id': employees[i]['id'],'name': employees[i]['name'],'mail': employees[i]['mail'],'status': 'pending'};
					  }
					  else{
							console.log('B');
							console.log(employees[i]);
							console.log(employees[i]['status']);
						  employees[i] = {'id': employees[i]['id'],'name': employees[i]['name'],'mail': employees[i]['mail'],'status': 'complete'};
						  console.log('B');
					  }
					  console.log(employees.length);
				  }
				  console.log(employees);
				  self.setEmps(employees);
				   //self.transitionToRoute('home.assign');

				}).then(function(reject){
				});
           //self.transitionToRoute('home.assign');

       }).then(function(reject){

       });

      var employee = {
        /*'name': document.getElementById("add-name").value,*/
        'name': 'placeholder',
        'mail': document.getElementById("add-mail").value,
        'status': null,
        'progress': progress
      }

      this.get('employees').pushObject(employee);

      //document.getElementById("add-name").vaue = "";
      document.getElementById("add-mail").value = "";

      document.getElementById('add-member').style.display = 'none';
      document.getElementById('cs-fog').style.display = 'none';
    },
    addAssignment: function() {
      if(this.get('controller').get('selectedBook')) {
        this.get('session').set('addAssignmentBookId', this.get('controller').get('selectedBook').id);
      } else {
        this.get('session').set('addAssignmentBookId', null);
      }
      this.transitionTo('home.assignment');
    },
    viewLesson: function() {
      this.transitionTo('home.view');
    },
    groupMail: function() {
      let employees = this.get('employees');
      let mail = [];
      for(let i = 0; i < employees.length; i++) {
        mail.push(employees[i].mail);
      }
      this.send('sendMailDialog', mail);
    },
    overdueMail: function() {
      let selected = this.controller.get('selected');
      let employees = this.get('employees');
      let mail = [];
      for(let i = 0; i < employees.length; i++) {
        if(employees[i].progress[selected].status === "overdue") {
          mail.push(employees[i].mail);
        }
      }
      this.send('sendMailDialog', mail);
    },
    individualMail: function(email) {
      let mail = [];
      mail.push(email);
      this.send('sendMailDialog', mail);
    },
    sendMailDialog: function(emails) {
      document.getElementById('send-mail').style.display = 'block';
      document.getElementById('cs-fog').style.display = 'block';
      let mailString = '';
      for(let i = 0; i < emails.length; i++) {
        mailString += emails[i] + ', ';
      }
      this.controller.set('mailString', mailString);
      this.controller.set('mailTo', emails);
    },
    sendMailCancel: function() {
      document.getElementById('send-mail').style.display = 'none';
      document.getElementById('cs-fog').style.display = 'none';
    },
    sendMailConfirm: function() {
      Ember.Logger.log('send Message: ');
      let message = document.getElementsByClassName('send-text')[0].value;
      Ember.Logger.log(message);
      Ember.Logger.log('to: ');
      let to = document.getElementsByClassName('send-to')[0].value;
      var array = to.split(',');
      Ember.Logger.log(array);
	  
	  ///emailToList
	  
	  Ember.$.ajax('http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/emailToList', {
       "type": 'POST', // HTTP method
       "crossDomain":true,
       "dataType": 'json', // type of data expected from the API response
       "data": {'emailList': to,
				'text' : message
				}
     }).then(function(resolve) {
		 
		 
		 
	 }).then(function(reject){

       });
	  
	  
      document.getElementById('send-mail').style.display = 'none';
      document.getElementById('cs-fog').style.display = 'none';
    },
	onChange: function(groupId){
      this.set('groupId', groupId)
	  window.console.log('w')
      window.console.log(this.get('selectedOption'))
      //window.console.log(this.get('groupId'))
      //window.console.log(groupId)
    },
//	onGroupSelect(groupId){
//		window.console.log(groupId);
//	}
///*
  }
});
