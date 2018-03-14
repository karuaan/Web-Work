import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { EmployeesService } from '../employees.service';
import { Employee } from '../employee';
import { Assignment } from '../assignment';
import { Group } from '../group';
import { MasterEntry } from '../master-entry';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [HttpClientModule]
})
export class EmployeesComponent implements OnInit {

	testEmployee: Employee;
	employees: Employee[];
	groups: Group[];
	assignments: Assignment[];
	masterEntryTable: MasterEntry[];
	selectedAssignment: Assignment;
	selectedGroup: Group;
	admin_id = 3;
	employeesService: EmployeesService;
	emailContents: string;
	
  constructor(employeesService: EmployeesService){
	  this.employees = [];
	  this.groups = [];
	this.assignments = [];
	this.employeesService = employeesService;
	
	employeesService.getMasterTable(this.admin_id).subscribe(data => {
		console.log(data);
	});
	
	employeesService.getGroups(this.admin_id).subscribe(data1 => {
		this.groups = data1;
		this.selectedGroup = data1[0];
		console.log(data1[0]);
		
		employeesService.getAssignments(data1[0].ID).subscribe(data2 => {
			this.assignments = data2;
			this.selectedAssignment = data2[0];
			console.log(data2[0]);
			
			employeesService.getEmployees(data1[0].ID, data2[0].assignment_id).subscribe(data3 => {
					this.employees = data3;
					console.log(data3[0]);
				
			});
		
		});
		
	});
	
	
  }
  
  emailGroup(text){
	  console.log(text);
	  console.log(this.emailContents);
  }
  
  emailGroupIncomplete(text){
	  console.log(text);
	  console.log(this.emailContents);
  }
  
  emailGroupLate(text){
	  console.log(text);
	  console.log(this.emailContents);
  }
  
  groupSelect(group){
	  console.log(group.ID);
	  this.selectedGroup = group;
	  this.employeesService.getAssignments(group.ID).subscribe(data2 => {
		  console.log(data2);
		  if(typeof(data2[0]) === undefined){
			  this.assignments = [];
			  this.selectedAssignment = null;
			  this.employees = [];
		  }
		  else{
			this.assignments = data2;
			this.selectedAssignment = data2[0];
			this.employeesService.getEmployees(group.ID, data2[0].assignment_id).subscribe(data3 => {
					this.employees = data3;
					console.log(data3[0]);
				
			});
		  }
		});
  }
  
  assignmentSelect(assignment){
	  
	this.selectedAssignment = assignment;
	this.employeesService.getEmployees(this.selectedGroup.ID, assignment.assignment_id).subscribe(data3 => {
			this.employees = data3;
			//console.log(data3[0]);
		
	});
  }

  ngOnInit() {
	  
	  this.selectedGroup = this.groups[0];
	  
  }

}
