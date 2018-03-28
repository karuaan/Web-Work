import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
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
import {BookService} from "../book.service";
import { FormControl, FormGroup,FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';

declare var $:any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [HttpClientModule]
})
export class EmployeesComponent implements OnInit {
	userEmail: string;
	userPassword: string;
	isLoggedIn = false;
	testEmployee: Employee;
	employees: Employee[];
	groups: Group[];
	books: Book[];
	assignments: Assignment[];
    potentialAssignments: Lesson[];
	lessons: Lesson[];
	selectedAssignment: Assignment;
	admin_id = 3;
	assignment_id: 1;
	pdfCurrentPage: string;
	pdfStartPage: Number;
	pdfEndPage: Number;
	employeesService: EmployeesService;
	authService: AuthService;
	emailContents: string;
	modalEmails: string;
	testPdf: Object;
    lookAtAssignments = true;

  viewAssignments: boolean;
  viewLessons: boolean;
  percentCompletes: Number[];
  currentPercentComplete: Number;

    bookGroupForm : FormGroup;
    assignmentGroupForm: FormGroup;

    bookForm: any = null;
    assignmentForm: any = null;

    private bookService: BookService;

    selectedGroup: Group;
    public selectedBook: number;
    public selectedBookData: Book;
    public selectedLesson: Lesson;
    public book_lessions: Lesson[];

    constructor(employeesService: EmployeesService, authService: AuthService, bookService: BookService,public fb:FormBuilder) {
    this.userEmail = '';
	this.userPassword = '';
	this.employees = [];
    this.groups = [];
    this.assignments = [];
    this.books = [];
    this.potentialAssignments = [];
    this.employeesService = employeesService;
    this.bookService = bookService;
	this.authService = authService;
    this.pdfCurrentPage = "1";
    this.bookForm = null;
    this.modalEmails = "";
	this.emailContents = "";
    this.lookAtAssignments = true;
    this.resetForm();
    this.reactiveFormGroup();

    document.getElementsByTagName('body')[0].style.backgroundColor = '#89CFF0';

    this.testPdf = {
      //url: 'https://vadimdez.github.io/ng2-pdf-viewer/pdf-test.pdf',
      url: 'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/6f08a44e-97c6-4ddd-b626-7d127eef77dc/book_file/Assignment1-Cloud-Computing.pdf',
      withCredentials: false
    };

    employeesService.getBooks().subscribe(data => {
      this.books = data;
      console.log('books');
      console.log(data);
      console.log(this.books);
    });

    employeesService.getLessons().subscribe(data => {
      this.lessons = data;
      console.log('lessons');
      console.log(data);
      console.log(this.lessons);
    });

    employeesService.getGroups(this.admin_id).subscribe(data1 => {
      this.groups = data1;
      this.selectedGroup = data1[0];
      this.initialLoad();

      employeesService.getAssignments(data1[0].ID).subscribe(data2 => {
        this.assignments = data2;
        this.selectedAssignment = data2[0];

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
          console.log('getEmployees');
          console.log(data3);
          console.log(data3);
        });
      });
    });
  }

    onFileChange($event){
        let file = null;
        if ($event.target.files.length > 0){
             file = $event.target.files[0]; // <--- File Object for future use.
        }
         this.bookGroupForm.controls['book_file'].setValue(file ? file.name : '');
    }

    isFieldValid(form, field: string) {
      return !form.get(field).valid && form.get(field).touched;
    }

    displayFieldCss(form,field: string) {
      return {
        'has-error': this.isFieldValid(form,field),
        'has-feedback': this.isFieldValid(form,field)
      };
    }

    reactiveFormGroup() : void {
        this.assignmentGroupForm = this.fb.group({
            start_date: new FormControl(null, Validators.required),
            due_date: new FormControl(null, Validators.required),
            minute: new FormControl(null, Validators.required),
            second: new FormControl(),
            comment: new FormControl(),
        });

        this.bookGroupForm = this.fb.group({
            NAME: new FormControl(null, Validators.required),
            book_file: new FormControl(null, Validators.required),
        });
    }

    initialLoad(): void {
        this.bookService.getBooks().subscribe((data: any) => {
            this.books = data.books;
            this.selectedBook = this.books[0].ID;
            this.selectedBookData = this.books[0];
            this.refreshBookLessons(this.selectedBook);
        });
    }

    selectLesson(lesson){
        this.selectedLesson = lesson;
        console.log('lesson',lesson);
    }
    resetForm(): void {
        this.bookForm = {
            NAME : '',
            fileData : null
        };

        this.assignmentForm = {
            start_date : null,
            due_date : null,
            minute : null,
            second : null,
            comment : null,
            time_to_complete : null,
            lesson_id : null,
            group_id : null
        };
    }
    saveBook(): void {
        // console.log('ss',this.bookForm);
        // let input = document.getElementById('bookName');
        // file = input.files[0];
        const fileList: FileList = $('#bookFile').prop('files');
        if(fileList.length > 0) {
            const file: File = fileList[0];
            const formData: FormData = new FormData();
            formData.append('book_file', file, 'public/book_files/' + file.name);
            formData.append('file_name', 'public/book_files/' + file.name);
            formData.append('file_size', `${file.size}`);
            formData.append('file_type', file.type);
            formData.append('book_name', this.bookForm.NAME);

            this.bookService.saveBooks(formData).subscribe((res: any) => {
                    if (res.data && res.data.ID) {
                        this.books.push(res.data as Book);
                        $('#newBookModal').modal('hide');
                    }
                  },
                  (err) => {
                    console.log('err', err);
                });
       } else {
            alert('upload file')
       }
    }

    saveAssignment(): void {

        if (this.assignmentGroupForm.invalid) {
            alert('Enter proper data!');
            return;
        }
        let minute = 0;
        let seconds = 0;
        if (this.assignmentForm.minute) {
            minute = this.assignmentForm.minute;
        }
        if (this.assignmentForm.second) {
            seconds = this.assignmentForm.second;
        }
        this.assignmentForm.time_to_complete = (minute * 60) + (seconds);
        this.assignmentForm.group_id = this.selectedGroup.ID;
        this.assignmentForm.lesson_id = this.selectedLesson.ID;

        const name = `ASSIGNMENT_${this.assignmentForm.lesson_id}_${this.assignmentForm.group_id}`;
        this.bookService.saveAssignment(this.assignmentForm.lesson_id, {
            NAME : name,
            LESSON_ID : this.assignmentForm.lesson_id,
            GROUP_ID : this.assignmentForm.group_id,
            DUE_DATE : this.assignmentForm.due_date,
            START_DATE : this.assignmentForm.start_date,
            TIME_TO_COMPLETE : this.assignmentForm.time_to_complete
        }).subscribe((res: any) => {
            if (res.status && res.data && res.data.affectedRows > 0) {
                this.selectedLesson.setGroup(this.assignmentForm.group_id);
                this.selectedLesson.setIsAssigned(true);
                this.book_lessions.forEach((item) => {
                    if(item.ID == this.assignmentForm.lesson_id){
                        item.setGroup(this.assignmentForm.group_id);
                    }
                });
                $('#newAssignment').modal('hide');
            } else {
                console.log('fail');
            }
         },
         (err) => {
           console.log('err',err);
       });
    }

    addLesson(): void {
        if (this.selectedBook) {
            const tempLession: Lesson = {
                ID: null,
                NAME: '',
                BOOK_ID: this.selectedBook,
                PDF_FILE: '',
                START_PAGE: null,
                is_checked: false,
                END_PAGE: null
            } as Lesson;
            this.book_lessions.push(new Lesson(
                tempLession.ID,
                tempLession.NAME,
                tempLession.BOOK_ID,
                tempLession.START_PAGE,
                tempLession.END_PAGE,
                tempLession.PDF_FILE)
            );
        }else{
            alert('please select book')
        }
    }

    discardAction(status){
        if (status) {
            // do the right thing...
        }else{
            /// continuee next process...
        }
    }

    onChangeBook(event){
       let book =  this.books.filter((item) => item.ID == this.selectedBook);
       if (book.length > 0){
           this.selectedBookData = book[0];
       }
        this.selectedLesson = null;
        this.refreshBookLessons(this.selectedBook);

        // $('#beforeChangePageOrBook').modal();
    }

    refreshBookLessons(bookID){
        this.book_lessions = [];
        this.bookService.getBookLessons(this.selectedBook).subscribe((lessons: Lesson[]) => {
            this.book_lessions = lessons.map((tempLession: Lesson) => {
                return new Lesson(
                    tempLession.ID,
                    tempLession.NAME,
                    tempLession.BOOK_ID,
                    tempLession.START_PAGE,
                    tempLession.END_PAGE,
                    tempLession.PDF_FILE,
                    tempLession.ASSIGNMENTS_GROUP_IDS
                );
            });
        });
    }

    saveLessions(): void {
        const new_lessons: any[] = this.book_lessions.filter((item) => {
             if(item.changed_state && item.validationCheck(this.selectedBookData.TOTAL_PAGES) || item.ID == null){
                return true;
            }else{
                return false;
            }
        }).map((item) => {
            return {
                ID : item.ID,
                NAME : item.NAME,
                action : item.ID ? 'existing' : 'new',
                BOOK_ID : item.BOOK_ID,
                BOOK_FILE_PDF: this.selectedBookData.PDF_FILE,
                END_PAGE : item.END_PAGE == null ? 0 : item.END_PAGE,
                PDF_FILE : item.PDF_FILE,
                START_PAGE : item.START_PAGE == null ? 0 : item.START_PAGE
            };
        });

        const data = {
            lessons : new_lessons,
            group_id : this.selectedGroup.ID,
            book_id : this.selectedBook,
        };

        if (new_lessons.length > 0){
            this.bookService.batchSaveLesson(data).subscribe((lessons: Lesson[]) => {
                this.refreshBookLessons(this.selectedBook);
            });
        }else{
            alert('Enter proper data');
        }
    }

    deleteSelected(): void{
        const lessionIds = this.book_lessions.filter((item) => item.is_checked == true && item.ID != null).map(item => item.ID);
        console.log('delete lessionIds',lessionIds);
        this.book_lessions = this.book_lessions.filter((item) => item.is_checked == false);
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

  emailConfirm(){
	console.log("Email")
	console.log(this.modalEmails);
	console.log(this.emailContents);
	this.employeesService.email(this.modalEmails, this.emailContents).subscribe(data => {
	
	});
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
    console.log('groupSelect');
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

  addAssignment() {
	  console.log("Add assignment works")
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
      console.log(this.books);
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
        document.getElementById('secondColumn').className = 'col-xl-7';
        document.getElementById('thirdColumn').className = 'col-xl-3';
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
	signInWithEmail() {
		console.log(this.userEmail);
		console.log(this.userPassword);
	   this.authService.signInRegular(this.userEmail, this.userPassword)
		  .then((res) => {
			 console.log(res);
			this.isLoggedIn = true;
		  })
		  .catch((err) => console.log('error: ' + err));
	}
  ngOnInit() {

    this.selectedGroup = this.groups[0];

  }

}
