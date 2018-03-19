import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { EmployeesService } from '../employees.service';
import { Employee } from '../employee';
import { Assignment } from '../assignment';
import { Group } from '../group';
import { Book } from '../book';
import { Lesson } from '../lesson';

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
	books: Book[];
	assignments: Assignment[];
	lessons: Lesson[];
	potentialAssignments: Lesson[];
	selectedAssignment: Assignment;
	selectedLesson: Lesson;
	selectedGroup: Group;
	admin_id = 3;
	assignment_id: 1;
	employeesService: EmployeesService;
	emailContents: string;
	
  constructor(employeesService: EmployeesService){
	  this.employees = [];
	  this.groups = [];
	this.assignments = [];
	this.books = [];
	this.potentialAssignments = [];
	this.employeesService = employeesService;
	
	employeesService.getBooks().subscribe(data => {
		this.books = data;
		console.log(this.books);
	});
	employeesService.getLessons().subscribe(data => {
		this.lessons = data;
		console.log(this.lessons);
	});
	
	employeesService.getGroups(this.admin_id).subscribe(data1 => {
		this.groups = data1;
		this.selectedGroup = data1[0];
		console.log(data1[0]);
		
		employeesService.getAssignments(data1[0].ID).subscribe(data2 => {
			this.assignments = data2;
			this.selectedAssignment = data2[0];
			console.log(data2[0]);
			
			this.potentialAssignments = this.lessons.filter( lesson => 
				for(var i = 0; i < this.assignments.length; ++i){
					if(this.assignments[i].lesson_id == lesson.ID){
						return false;
					}
				}; return true;
			);
			
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
			if(!data2['err']){
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
			}
			else{
				this.assignments = [{"assignment_id": -1, "NAME": "No assignments", "START_DATE": null, "DUE_DATE": null}];
				this.selectedAssignment = this.assignments[0];
				this.employeesService.getEmployees(group.ID, -1).subscribe(data3 => {
						this.employees = data3;
						console.log(data3[0]);
					
				});
			}
			this.potentialAssignments = this.lessons.filter( lesson => 
				for(var i = 0; i < this.assignments.length; ++i){
					if(this.assignments[i].lesson_id == lesson.ID){
						return false;
					}
				}; return true;
			);
			console.log(this.potentialAssignments);
		});
  }
  
  addAssignment(){
	  console.log("Add assignment works")
  }
  
  addGroup(){
	  console.log("Add group works")
  }
  
  assignmentSelect(assignment){
	  
	this.selectedAssignment = assignment;
	this.employeesService.getEmployees(this.selectedGroup.ID, assignment.assignment_id).subscribe(data3 => {
			this.employees = data3;
			//console.log(data3[0]);
		
	});
  }
  
  lessonSelect(lesson){
	  this.selectedLesson = lesson;
  }

  ngOnInit() {
	  
	  this.selectedGroup = this.groups[0];
	  
  }

}
