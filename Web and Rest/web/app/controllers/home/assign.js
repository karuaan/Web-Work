import Ember from 'ember';

export default Ember.Controller.extend({
	setGID: function(groupId){
		this.propertyWillChange('groupId');
		this.set('groupId', groupId);
		this.propertyDidChange('groupId');
	},
	setEmps: function(employees){
		this.propertyWillChange('employees');
		this.set('employees', employees);
		this.propertyDidChange('employees');
	},
	setAssigns: function(assignments){
		this.propertyWillChange('assignments');
		this.set('assignments', assignments);
		this.propertyDidChange('assignments');
	},
	selectedBook: null,
	employees: [],
	groupId: -1,
	  session: Ember.inject.service('session'),

	actions:{
		groupMail: function() {
		  let employees = this.get('employees');
		  console.log(employees);
		  let mail = [];
		  for(let i = 0; i < employees.length; i++) {
			mail.push(employees[i].mail);
		  }
		  this.send('sendMailDialog', mail);
		},
		overdueMail: function() {	//Reliant on status rework
		  let selected = this.get('selected');
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

		onGroupSelect(groupId){
			console.log(this.get('session').get('userData') )
			var self=this;
			this.setGID(groupId);
			//var restServerURL = 'http://localhost:3000';
			var restServerURL = 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000';
			//console.log(groupId);
			var employees = [];
			var assignments = [];
			var admin_id = 3;
			//console.log(this.get('employees'))
			//console.log('***');
			//console.log(groupId);
			//this.session.set('groupId', groupId);
			console.log('***');
			Ember.$.ajax(restServerURL + '/getemployees', {
			  "type": 'POST', // HTTP method
			  "crossDomain":true,
			  "dataType": 'json', // type of data expected from the API response
			  "data": { // Begin data payload
				"group_id" : groupId // nilesh commnet - change this id with persisted groupID
			  }
			}).then(function(resolve) {

			  let gID = groupId;
			  for(var i=0;i<resolve.length;i++) {
				var employee={};
				employee["name"] = resolve[i]["FIRST_NAME"] + " " + resolve[i]["LAST_NAME"];
				employee["id"] = resolve[i]["ID"];
				employee["mail"] = resolve[i]["EMAIL"];
				employee["status"] = resolve[i]["STATUS"];
				employee["progress"] = resolve[i]["PROGRESS"];
				console.log(employee);
				employees.push(employee);
			  }
			  self.setEmps(employees);
			  if ((self.get('session').get('userData')) === undefined){
				  admin_id = 3;
			  }
			  else{
				  admin_id = self.get('session').get('userData');
			  }
			  console.log(":::");
			  console.log(admin_id);
			  console.log(groupId);
			  console.log(gID);
				Ember.$.ajax(restServerURL + '/getassignments', {
				  "type": 'POST', // HTTP method
				  "crossDomain":true,
				  "dataType": 'json', // type of data expected from the API response
				  "data": { // Begin data payload
					"admin_id" : admin_id, // nilesh commnet - change this id with user ud
					"group_id" : groupId
				  }
				}).then(function(resolve) {
				  //window.console.log(resolve.length);
				  //window.console.log(controller.get("groups"));
				  //groups = self.get("groups");
				  for(var i=0;i<resolve.length;i++) {
					var assignment={};
					assignment["name"] = resolve[i]["NAME"];
					assignment["id"] = resolve[i]["assignment_id"];
					assignment["dueDate"] = resolve[i]["DUE_DATE"];
					assignment["startDate"] = resolve[i]["START_DATE"];
					assignments.push(assignment);
				  }
				  self.setAssigns(assignments);
				  console.log(assignments[0]['id']);
				  console.log(groupId);
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

				}).then(function(reject){
				});


			  return employees;

			}).then(function(reject){
			});
			this.set('employees', employees);
			//this.notifyPropertyChange('employees');
		}
	/* 		var employees = [];
			var assignments = [];
			console.log(groupId);
			//this.set('groupId', groupId);
			Ember.$.ajax('http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/getemployees',
			{
			'type': 'POST',
			'crossDomain': true,
			'dataType': 'json',
			'data': {
				"group_id" : groupId
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
        employee["progress"] = resolve[i]["PROGRESS"];
        employees.push(employee);
      }



    }).then(function(reject){
    });
		Ember.$.ajax('http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/getassignments', {
      "type": 'POST', // HTTP method
      "crossDomain":true,
      "dataType": 'json', // type of data expected from the API response
      "data": { // Begin data payload
        "admin_id" : 4, // nilesh commnet - change this id with user ud
		"group_id" : groupId
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
      //this.set('assignments', assignments);


    }).then(function(reject){
    }); */

	}

});
