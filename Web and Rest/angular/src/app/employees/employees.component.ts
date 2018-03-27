import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { NgModel } from '@angular/forms';
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
	pdfCurrentPage: string;
	pdfStartPage: Number;
	pdfEndPage: Number;
	employeesService: EmployeesService;
	emailContents: string;
	modalEmails: string;
	testPdf: Object;
<<<<<<< HEAD

  viewAssignments: boolean;
  viewLessons: boolean;
  percentCompletes: Number[];

  constructor(employeesService: EmployeesService){
    this.employees = [];
    this.groups = [];
    this.assignments = [];
    this.books = [];
    this.potentialAssignments = [];
    this.employeesService = employeesService;
    this.pdfCurrentPage = "2";
    this.modalEmails = "";
    this.testPdf = {
      //url: 'https://vadimdez.github.io/ng2-pdf-viewer/pdf-test.pdf',
      url: 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/6f08a44e-97c6-4ddd-b626-7d127eef77dc/book_file/Assignment1-Cloud-Computing.pdf',
      withCredentials: false
    };

    employeesService.getBooks().subscribe(data => {
      this.books = data;
      console.log('books');
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

        const my_this = this; //needed for filter function

        this.potentialAssignments = this.lessons.filter( function(lesson){
          for(var i = 0; i < my_this.assignments.length; ++i){
            if(my_this.assignments[i].lesson_id == lesson.ID){
              return false;
            }
          };
          return true;
        });

        employeesService.getEmployees(data1[0].ID, data2[0].assignment_id).subscribe(data3 => {
          this.employees = data3;
          console.log(data3[0]);
        });
      });
    });
=======
	lookAtAssignments = true;
	
  constructor(employeesService: EmployeesService){
	  this.employees = [];
	  this.groups = [];
	this.assignments = [];
	this.books = [];
	this.potentialAssignments = [];
	this.employeesService = employeesService;
	this.pdfCurrentPage = "2";
	this.modalEmails = ""
	this.testPdf = {
		//url: 'https://vadimdez.github.io/ng2-pdf-viewer/pdf-test.pdf',
		url: 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/6f08a44e-97c6-4ddd-b626-7d127eef77dc/book_file/Assignment1-Cloud-Computing.pdf',
		withCredentials: false
	};
	this.lookAtAssignments = true;
	
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
		
		employeesService.getAssignments(data1[0].ID).subscribe(data2 => {
			this.assignments = data2;
			this.selectedAssignment = data2[0];
			
			const my_this = this; //needed for filter function
			
			this.potentialAssignments = this.lessons.filter( function(lesson){ 
				for(var i = 0; i < my_this.assignments.length; ++i){
					if(my_this.assignments[i].lesson_id == lesson.ID){
						return false;
					}
				}; return true;
			});
			
			employeesService.getEmployees(data1[0].ID, data2[0].assignment_id).subscribe(data3 => {
					this.employees = data3;
			});
		
		});
		
	});
	
	
>>>>>>> 6e7a189e2c2439ed9ce7ee407aa07b3b947306b8
  }

  incrementPage() {
    console.log(this.pdfCurrentPage)
    this.pdfCurrentPage = String(Number(this.pdfCurrentPage) + 1);
    console.log(this.pdfCurrentPage)
  }

  decrementPage() {
    console.log(this.pdfCurrentPage)
    this.pdfCurrentPage = String(Number(this.pdfCurrentPage) - 1);
    console.log(this.pdfCurrentPage)
  }

  setStartPage() {
	  this.pdfStartPage = Number(this.pdfCurrentPage);
	  if(this.pdfStartPage > this.pdfEndPage){
		  this.pdfEndPage = this.pdfStartPage;
	  }
  }

  setEndPage() {
    this.pdfEndPage = Number(this.pdfCurrentPage);
    if(this.pdfEndPage < this.pdfStartPage){
      this.pdfStartPage = this.pdfEndPage;
    }
  }

  emailGroup(text) {
    this.modalEmails = this.employees.map(employee => employee.EMAIL).reduce(function(total, next){return total + ", " + next});
  }

  emailGroupIncomplete(text) {
    console.log(text);
    console.log(this.emailContents);
  }

  emailGroupLate(text) {
    console.log(text);
    console.log(this.emailContents);
  }

  groupSelect(group) {
    console.log(group.ID);
    this.selectedGroup = group;
    this.employeesService.getAssignments(group.ID).subscribe(data2 => {
      console.log(data2);
      if(!data2['err']) {
        if(typeof(data2[0]) === undefined){
          this.assignments = [];
          this.selectedAssignment = null;
          this.employees = [];
        } else {
          this.assignments = data2;
          this.selectedAssignment = data2[0];
          this.employeesService.getEmployees(group.ID, data2[0].assignment_id).subscribe(data3 => {
            this.employees = data3;
            console.log(data3[0]);
          });
        }
      } else {
        this.assignments = [{"assignment_id": -1, "NAME": "No assignments", "START_DATE": null, "DUE_DATE": null, "book_id": -1, "lesson_id": -1}];
        this.selectedAssignment = this.assignments[0];
        this.employeesService.getEmployees(group.ID, -1).subscribe(data3 => {
          this.employees = data3;
          console.log(data3[0]);
        });
      }

			const my_this = this; //needed for filter function

			this.potentialAssignments = this.lessons.filter( function(lesson){
				for(var i = 0; i < my_this.assignments.length; ++i){
					if(my_this.assignments[i].lesson_id == lesson.ID){
						return false;
					}
				};
        return true;
			});
			console.log(this.potentialAssignments);
		});
  }
<<<<<<< HEAD

  addAssignment() {
    console.log("Add assignment works")
=======
  
  setAssignmentsActive(){
	this.lookAtAssignments = true;
  }
  
  setLessonsActive(){
	this.lookAtAssignments = false;
  }
  
  addAssignment(){
	  console.log("Add assignment works")
>>>>>>> 6e7a189e2c2439ed9ce7ee407aa07b3b947306b8
  }

  addGroup() {
	  console.log("Add group works")
  }

  viewSwitch(selected) {
    var assignmentButton = document.getElementById('assignmentButton');
    var lessonButton = document.getElementById('lessonButton');
    if(assignmentButton == null || assignmentButton == undefined) {
      assignmentButton = document.getElementById('assignmentButtonActive');
    }
    if(lessonButton == null || lessonButton == undefined) {
      lessonButton = document.getElementById('lessonButtonActive');
    }

    if(selected === "assignments") {
      this.viewLessons = false;
      lessonButton.id = 'lessonButton';
      if(this.viewAssignments) {
        this.viewAssignments = false;
        assignmentButton.id = 'assignmentButton';
        document.getElementById('secondColumn').className = 'col-xl-0';
        document.getElementById('thirdColumn').className = 'col-xl-10';
      } else {
        this.viewAssignments = true;
        assignmentButton.id = 'assignmentButtonActive';
        document.getElementById('secondColumn').className = 'col-xl-2';
        document.getElementById('thirdColumn').className = 'col-xl-8';
      }
    } else if (selected === "lessons") {
      this.viewAssignments = false;
      assignmentButton.id = 'assignmentButton';
      if(this.viewLessons) {
        this.viewLessons = false;
        lessonButton.id = 'lessonButton';
        document.getElementById('secondColumn').className = 'col-xl-0';
        document.getElementById('thirdColumn').className = 'col-xl-10';
      } else {
        this.viewLessons = true;
        lessonButton.id = 'lessonButtonActive';
        document.getElementById('secondColumn').className = 'col-xl-6';
        document.getElementById('thirdColumn').className = 'col-xl-4';
      }
    }
  }

  assignmentSelect(assignment, index) {
    let assignments = document.getElementsByClassName('assignment-summary');
    for(let i = 0; i < assignments.length; i++) {
      if(index == i) {
        assignments[i].className = 'assignment-summary assignment-summary-selected';
      } else {
        assignments[i].className = 'assignment-summary';
      }
    }
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
