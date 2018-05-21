import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmployeesService } from '../employees.service';
import { Employee } from '../employee';
import { Assignment } from '../assignment';
import { Group } from '../group';
import { Book, BookNew } from '../book';
import { Lesson } from '../lesson';
import { BookService } from "../book.service";
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PDFDocumentProxy, PDFProgressData } from 'ng2-pdf-viewer';
import { AuthService } from '../auth.service';
import {saveAs} from 'file-saver';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

declare var $: any;

@Component({
    selector: 'app-employees',
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.css'],
    providers: [HttpClientModule]
})
export class EmployeesComponent implements OnInit {

    dataObj: any = {
        books: [],
        employee_status: [],
        book_lessons: [],
        selected_group: null,
        selectedBook: null,
        activeBooks: {},
        selectedLessonPlan: null,
        selectedLesson: null,
        selectedAssignment: null,
    };


    userEmail: string;
    userPassword: string;
    isLoggedIn = false;
    isLoginError = false;
    newBookAdded = false;
    newUser = false;
    loginErrorMessage = "";
    admin_password = "";
    url = "";

    newPassword = "";
    confirmPassword = "";
    firstName = "";
    lastName = "";

    newUserFirstName = "";
    newUserLastName = "";
    newUserPhoneNumber = "";

    testEmployee: Employee;
    employees: Employee[];
    groups: Group[];
    books: any;
    assignments: Assignment[];
    potentialAssignments: Lesson[];
    lessons: Lesson[];
    selectedAssignment: Assignment;
    selectedAssignmentCompletion: string;
    admin_id = -1;
    assignment_id: 1;
    pdfCurrentPage: string;
    pdfCurrentPagePreview: string;
    pdfStartPage: Number;
    pdfEndPage: Number;
    employeesService: EmployeesService;
    authService: AuthService;
    emailContents: string;
    modalEmails: string;
	modalEmailsIncomplete: string;
    testPdf: Object;
    viewPdf = false;
    lookAtAssignments = true;

    newUserError = undefined;

    viewAssignments: boolean;
    viewLessons: boolean;
    percentCompletes: Number[];
    currentPercentComplete: Number;

	editAssignmentValues: {};

    bookGroupForm: FormGroup;
    assignmentGroupForm: FormGroup;
	editAssignmentGroupForm: FormGroup;
    employeeForm: FormGroup;

    bookForm: any = null;
    groupForm: any = FormGroup;
    inviteAdminForm: any = FormGroup;
    assignmentForm: any = null;
    newUserObject: any = null;

    sortAscending = true;
    sortDescending = true;

    countdown: Number;
    previewPdf: Object;
    pdfCurrentPagePreviewMax: string;
    currentDate: Date;
    warningDate: Date;

    private bookService: BookService;
	private ng4LoadingSpinnerService: Ng4LoadingSpinnerService;

    selectedGroup: Group;
    public selectedBook: number;
    public fb: FormBuilder;
    public toastrService: ToastrService;
    public validators = [this.validateEmail];
    public errorMessages = {
        'validateEmail': 'invalid email address'
    };

    constructor(employeesService: EmployeesService,
			toastrService: ToastrService,
			authService: AuthService,
			bookService: BookService,
			fb: FormBuilder,
			ng4LoadingSpinnerService: Ng4LoadingSpinnerService
		) {
        this.currentDate = new Date();
        let testDate = new Date();
        testDate = new Date(testDate.setDate(new Date().getDate() - 3));
        this.warningDate = testDate;
        this.fb = fb;
        this.employeesService = employeesService;
        this.bookService = bookService;
        this.authService = authService;
        this.toastrService = toastrService;
		this.ng4LoadingSpinnerService = ng4LoadingSpinnerService;

        this.userEmail = "";
        this.userPassword = "";
        this.isLoginError = false;
        this.newUser = false;
        this.loginErrorMessage = "";
        this.admin_password = "";

		this.modalEmailsIncomplete = "";

        this.newPassword = "";
        this.confirmPassword = "";
        this.firstName = "";
        this.lastName = "";

        this.newUserFirstName = "";
        this.newUserLastName = "";

        this.employees = [];
        this.groups = [];
        this.assignments = [];
        this.books = [];
        this.potentialAssignments = [];

        this.pdfCurrentPage = "1";
        this.bookForm = null;
        this.modalEmails = "";
		this.modalEmailsIncomplete = "";
        this.emailContents = "";
        this.lookAtAssignments = true;

        this.resetForm();
        this.reactiveFormGroup();

        document.getElementsByTagName('body')[0].style.backgroundColor = '#89CFF0';
    }


    onAdminLogin(admin_id) {
		this.ng4LoadingSpinnerService.show();

            this.employeesService.getGroups(admin_id).subscribe(groups => {
                this.groups = groups;
                this.selectedGroup = groups[0] || null;
                console.log(this.selectedGroup);
                this.transformResponseAndPopulate();

                this.employeesService.getAssignments(this.selectedGroup.ID).subscribe(assignments => {
                    console.log(this.selectedGroup);
                    if (assignments && assignments.hasOwnProperty('err')) {
                        if (this.selectedGroup) {
                            this.employeesService.getEmployees(
                                this.selectedGroup.ID,
                                -1
                            ).subscribe(employees => {
                                console.log(employees);
                                this.employees = employees;
								this.emailGroup();
								this.emailGroupIncomplete();
                                this.ng4LoadingSpinnerService.hide();
                            }, err => {
								this.toastrService.warning('Server Error', 'Unable to populate employees, please try again or contract support');
							});
                        }
                        this.assignments = [{
                            "assignment_id": -1,
                            "NAME": "No assignments",
                            "START_DATE": null,
                            "DUE_DATE": null,
                            "book_id": -1,
                            "lesson_id": -1,
                            "NOTES": "",
                            "TIME_TO_COMPLETE": 0
                        }];
                        this.selectedAssignment = assignments[0];
                        this.editAssignmentValues = {'START_DATE' : this.selectedAssignment.START_DATE, 'DUE_DATE' : this.selectedAssignment.DUE_DATE, 'MINUTES' : this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS' : this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES' : this.selectedAssignment.NOTES};
                        this.countdown = new Date(1970, 0, 1).setSeconds(0);
                    } else {
                        this.assignments = assignments;
                        this.selectedAssignment = assignments[0];
						this.editAssignmentValues = {'START_DATE' : this.selectedAssignment.START_DATE, 'DUE_DATE' : this.selectedAssignment.DUE_DATE, 'MINUTES' : this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS' : this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES' : this.selectedAssignment.NOTES};

                        this.countdown = new Date(1970, 0, 1).setSeconds(this.selectedAssignment.TIME_TO_COMPLETE);
                        if (this.selectedGroup && this.selectedAssignment) {
                            this.employeesService.getEmployees(
                                this.selectedGroup.ID,
                                this.selectedAssignment.assignment_id
                            ).subscribe(employees => {
                                this.employees = employees;

                                let complete = 0;
                                let total = employees.length;
                                for (let i = 0; i < employees.length; i++) {
                                    console.log(employees[i]);
                                    if (employees[i].IS_COMPLETE !== null) {
                                        if (employees[i].IS_COMPLETE.data[0] === 1) {
                                            complete = complete + 1;
                                        }
                                    }
                                }

                                if (complete === 0) {
                                    this.selectedAssignmentCompletion = 0 + "%";
                                } else {
                                    this.selectedAssignmentCompletion = Math.floor((complete / total) * 100) + "%";
                                }
								this.emailGroup();
								this.emailGroupIncomplete();
                                this.ng4LoadingSpinnerService.hide();
                            }, err => {
								this.toastrService.warning('Server Error', 'Unable to populate employees, please try again or contract support');
							});
                        }
                        this.loadAssignmentPreview();
                    }
                    this.loadAssignmentPreview();
                });
            }, err => {
				this.toastrService.warning('Server Error', 'Unable to populate groups, please try again or contract support');
			});
    }


    transformLessonModel(tempLession: Lesson) {
        return new Lesson(
            tempLession.ID,
            tempLession.NAME,
            tempLession.BOOK_ID,
            tempLession.START_PAGE,
            tempLession.END_PAGE,
            tempLession.PDF_FILE,
            tempLession.ASSIGNMENTS_GROUP_IDS
        );
    }

    transformResponseAndPopulate() {
        this.bookService.getStatuses().subscribe((res: any) => {
            this.dataObj.employee_status = res;
        });

        this.employeesService.getBooks(this.selectedGroup.ID).subscribe(books => {
            const bookMapping = (books: BookNew[], lessons: Lesson[]) => {
                return books.map((book: BookNew) => {
                    if (!lessons || lessons.length==0){
                        book.LESSONS = [];
                    }
                    book.LESSONS = lessons.filter((lesson: Lesson) => lesson.BOOK_ID == book.ID).map((tempLession: Lesson) => {
                        return this.transformLessonModel(tempLession);
                    });
                    if (book.ACTIVE){
                        this.dataObj.selectedBook = book;
                        this.selectedBook = book.ID;
                    }
                    console.log(book);
                    return book;
                });
            };
            console.log("Group ID");
            console.log(this.selectedGroup.ID);
            if (this.selectedGroup !== undefined && this.selectedGroup !== null) {
                this.employeesService.getLessons(this.selectedGroup.ID).subscribe(data => {
                    console.log(books);
                    this.dataObj.books = bookMapping(books, data);
                    if (!this.dataObj.selectedBook){
                        this.selectedBook = books[0].ID;
                        this.dataObj.selectedBook = books[0];
                    }
                    this.updatePdfBookPreview();
                }, (err) => {
                    this.dataObj.books = bookMapping(books, []);
                    this.updatePdfBookPreview();
                });
            }
            else {
                this.dataObj.books = bookMapping(books, []);
                this.updatePdfBookPreview();
            }
        });
    }

    updatePdfBookPreview() {
        this.testPdf = {
            url: `${this.bookService._api.endpoint}/read-pdf?path=${this.dataObj.selectedBook.PDF_FILE}`,
            withCredentials: false
        };
    }

    onFileChange($event) {
        let file = null;
        if ($event.target.files.length > 0) {
            file = $event.target.files[0]; // <--- File Object for future use.
        }
        this.bookGroupForm.controls['book_file'].setValue(file ? file.name : '');
    }

    isFieldValid(form, field: string) {
        return !form.get(field).valid && form.get(field).touched;
    }

    private validateEmail(control: FormControl) {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(control.value))) {
            return {
                'invalidEmail': true
            };
        }
        return null;
    }

    onItemAdded(event) {
        console.log('event', event, this.validateEmail(event.value));
    }

    displayFieldCss(form, field: string) {
        return {
            'has-error': this.isFieldValid(form, field),
            'has-feedback': this.isFieldValid(form, field)
        };
    }

    reactiveFormGroup(): void {
        this.assignmentGroupForm = this.fb.group({
            start_date: new FormControl(null, Validators.required),
            due_date: new FormControl(null, Validators.required),
            minute: new FormControl(null, Validators.required),
            second: new FormControl(),
            comment: new FormControl(),
        });

		this.editAssignmentGroupForm = this.fb.group({
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

        this.employeeForm = this.fb.group({
            email: new FormControl(null, [Validators.required, Validators.email]),
            // first_name: new FormControl(null, Validators.required),
            // group_id: new FormControl(null, Validators.required),
            // last_name: new FormControl(null, Validators.required),
        });

        this.groupForm = this.fb.group({
            group_name: new FormControl(null, [Validators.required]),
            emails: new FormControl(null, [Validators.required]),
        });

        this.inviteAdminForm = this.fb.group({
            email: new FormControl(null, [Validators.required]),
        });
    }

    initialLoad(): void {
        // this.bookService.getBook().subscribe((data: any) => {
        //     this.books = data.books;
        //     this.selectedBook = this.books[0].ID;
        //     this.selectedBookData = this.books[0];
        //     this.refreshBookLessons(this.selectedBook);
        // });
    }

    selectLesson(lesson) {
        this.dataObj.selectedLesson = lesson;
        console.log('lesson', lesson);
    }

    resetForm(): void {
        this.bookForm = {
            NAME: '',
            fileData: null
        };

        this.assignmentForm = {
            start_date: null,
            due_date: null,
            minute: null,
            second: null,
            comment: null,
            time_to_complete: null,
            lesson_id: null,
            group_id: null
        };
    }

    saveBook(): void {
        // console.log('ss',this.bookForm);
        // let input = document.getElementById('bookName');
        // file = input.files[0];
        const fileList: FileList = $('#bookFile').prop('files');
        if (fileList.length > 0) {
            const file: File = fileList[0];
            const formData: FormData = new FormData();
            formData.append('book_file', file, 'public/book_files/' + file.name);
            formData.append('file_name', 'public/book_files/' + file.name);
            formData.append('file_size', `${file.size}`);
            formData.append('file_type', file.type);
            formData.append('book_name', this.bookForm.NAME);
            formData.append('group_id', this.selectedGroup.ID.toString());

            this.bookService.saveBooks(formData).subscribe((res: any) => {
                if (res.data && res.data.ID) {
                    const newBook = res.data as BookNew;
					this.dataObj.books.push(newBook);
                    this.selectedBook = newBook.ID;
                    this.dataObj.selectedBook = newBook;
                    this.newBookAdded = true;
                    this.updatePdfBookPreview();
                    this.dataObj.selectedLesson = null;
                }
                this.toastrService.success('Book', 'Saved');
                $('#newBookModal').modal('hide');
            },
                (err) => {
                    this.toastrService.warning('Book', 'Save fail');
                });
        } else {
            this.toastrService.success('Book', 'Enter proper data');
        }
    }

    saveAssignment(): void {

        if (this.assignmentGroupForm.invalid) {
            this.toastrService.warning('Assignment', 'Enter proper data!');
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
        this.assignmentForm.lesson_id = this.dataObj.selectedLesson.ID;

        const name = this.dataObj.selectedLesson.NAME;
        const dataForm = {
            assignment_id: null,
            NAME: name,
            NOTES: this.assignmentForm.notes,
            LESSON_ID: this.assignmentForm.lesson_id,
            GROUP_ID: this.selectedGroup.ID,
            DUE_DATE: this.assignmentForm.due_date,
            START_DATE: this.assignmentForm.start_date,
            TIME_TO_COMPLETE: this.assignmentForm.time_to_complete
        };

        if (this.assignmentForm.notes && this.assignmentForm.notes != "") {
            dataForm['NOTES'] = this.assignmentForm.notes;
        }
        console.log(this.assignmentForm.time_to_complete);
        this.bookService.saveAssignment(this.assignmentForm.lesson_id, dataForm).subscribe((res: any) => {
            console.log('res', res);
            if (res.status && res.data && res.data.ID) {

                let notes = dataForm.NOTES;
                let assign: Assignment = {
                    NAME: name,
                    lesson_id: dataForm.LESSON_ID,
                    book_id: this.dataObj.selectedLesson.BOOK_ID,
                    DUE_DATE: this.assignmentForm.due_date,
                    START_DATE: this.assignmentForm.start_date,
                    NOTES: this.assignmentForm.notes,
                    assignment_id: res.data.ID,
					percent_complete: 0,
                    TIME_TO_COMPLETE: this.assignmentForm.time_to_complete
                };

                console.log('NEW assignMENT', assign);

                if (this.assignments.length > 0 && this.assignments[0].assignment_id == -1) {
                    this.assignments.splice(0, 1);
                }
                if (!this.assignments) {
                    this.assignments = [];
                }

                this.assignments.push(assign);
                this.selectedAssignment = assign;
				this.editAssignmentValues = {'START_DATE' : this.selectedAssignment.START_DATE, 'DUE_DATE' : this.selectedAssignment.DUE_DATE, 'MINUTES' : this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS' : this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES' : this.selectedAssignment.NOTES};

                this.countdown = new Date(1970, 0, 1).setSeconds(this.selectedAssignment.TIME_TO_COMPLETE);

                this.dataObj.selectedBook.LESSONS.forEach((item) => {
                    if (item.ID == dataForm.LESSON_ID) {
                        console.log('itemitem', item);
                        item.setGroup(this.selectedGroup.ID);
                        item.setIsAssigned(true);
                    }
                });

                this.assignmentGroupForm.reset();
                this.resetForm();

                console.log('this.assignments', this.assignments);
                this.toastrService.success('Assignment', 'Saved');
                $('#newAssignment').modal('hide');

            } else {
                this.toastrService.warning('Assignment', 'Please enter proper data');
            }
        },
            (err) => {
                this.toastrService.warning('Assignment', 'Internal server error');
            });
    }

    addLesson(): void {
        if (this.dataObj.selectedBook) {

            if (!this.dataObj.selectedBook.LESSONS) {
                this.dataObj.selectedBook.LESSONS = [];
            }
            this.dataObj.selectedBook.LESSONS.push(new Lesson(null, '', this.dataObj.selectedBook.ID, null, null, ''));
        } else {
            this.toastrService.warning('Lesson', 'Please select book');
        }
    }

    createLesson(title, pageStart, pageEnd): void {
        if (this.dataObj.selectedBook) {
            if (!this.dataObj.selectedBook.LESSONS) {
                this.dataObj.selectedBook.LESSONS = [];
            }
            //this.dataObj.selectedBook.LESSONS.push(new Lesson(null, title, this.dataObj.selectedBook.ID, pageStart, pageEnd, this.selectedGroup.ID))
        }
    }

    discardAction(status) {
        if (status) {
            // do the right thing...
        } else {
            /// continuee next process...
        }
    }

    saveEmployee() {
        if (this.employeeForm.invalid) {
            this.toastrService.warning('Employee', 'Enter proper data');
            return;
        }
        const dataEmployee = {
            FIRST_NAME: '',
            LAST_NAME: '',
            group_name: this.selectedGroup.NAME,
            GROUP_ID: this.selectedGroup.ID,
            EMAIL: this.employeeForm.value.email
        };
        console.log(this.employeeForm.value);
        this.bookService.saveEmployee(
            this.selectedGroup.ID,
            dataEmployee
        ).subscribe((res: any) => {

            console.log('this.employees', this.employees);

            if (res.employees && res.employees.length > 0 && res.employees[0].ID) {
                this.employeeForm.reset();

                if (res.data.length) {
                    const emp = this.employees.filter((item: Employee) => {
                        return item.ID == res.data[0]['USER_ID'];
                    });
                    if (emp.length == 0) {
                        this.employees.push(Object.assign(res.employees[0], {
                            IS_COMPLETE: null
                        }));
                        this.toastrService.success('Employee', 'Saved');
                    } else {
                        this.toastrService.success('Employee', 'Already Added');
                    }
                }


                // if (res.is_new) {
                //     this.toastrService.success('Employee', 'Saved');
                // } else {
                //     this.toastrService.success('Employee', 'Group assign to employee');
                // }
                $('#addEmployeeModal').modal('hide');
            } else {
                this.toastrService.warning('Employee', 'Save Failed');
            }
        }, (err) => {
            this.toastrService.warning('Employee', 'Save Failed');
        });
    }

    saveGroup() {
        if (this.groupForm.invalid) {
            this.toastrService.warning('Employee', 'Enter proper data');
            return;
        }

        const groupData = {
            NAME: this.groupForm.value.group_name,
            employees: this.groupForm.value.emails.map(item => {
                return {
                    FIRST_NAME: '', //item.value.replace(/@.*$/, '')
                    LAST_NAME: '',
                    EMAIL: item.value
                };
            }),
			ADMIN_ID: this.admin_id
        };

        this.bookService.saveGroup(groupData).subscribe((res: any) => {
            console.log("AAAAA");
			if (res && !res.status && res.message) {
                this.toastrService.warning('Group', res.message);
				console.log("BBBBB");
            } else {
				console.log("CCCCC");
                if (res.data && res.data.length > 0) {
                    const newGroup = {
                        ID: res.data[0].ID,
                        NAME: res.data[0].NAME
                    };
                    this.groups.push(newGroup);
                    this.groupSelect(newGroup);
					console.log("DDDDD")
                }
				console.log("EEEEE")
                this.toastrService.success('Group', 'Saved');
                this.groupForm.reset();
                $('#addGroupModal').modal('hide');
				console.log("Success add groups")
				//this.onAdminLogin(this.admin_id);
            }
        }, (err) => {
            this.toastrService.warning('Group', 'Internal server error');
        });

    }

    makepass() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    toggleMenu() {
        if (document.getElementById('adminMenu').style.display === 'block') {
            document.getElementById('adminMenu').style.display = 'none';
        } else {
            document.getElementById('adminMenu').style.display = 'block';
        }
    }
    inviteAdminAction() {

        document.getElementById('adminMenu').style.display = 'none';
    }
    inviteAdmin() {
		this.ng4LoadingSpinnerService.show();
        document.getElementById('adminMenu').style.display = 'none';
        if (this.inviteAdminForm.invalid) {
            this.toastrService.warning('Invite', 'Enter valid Email address');
			this.ng4LoadingSpinnerService.hide();
            return;
        }
        this.admin_password = this.makepass();
        const inviteData = {
            email: this.inviteAdminForm.value.email,
            pass: this.admin_password
        };

        this.employeesService.sendInvitationAdmin(inviteData).subscribe((res: any) => {
            if (res && !res.status && res.message) {
                this.toastrService.warning('Invite', res.message);
				this.ng4LoadingSpinnerService.hide();
            } else {
                    this.toastrService.success('Invite', 'Success');
                    this.inviteAdminForm.reset();
                    $('#inviteAdminModal').modal('hide');
					this.ng4LoadingSpinnerService.hide();
            }
        }, (err) => {
            this.toastrService.warning('Invite', 'Internal server error');
			this.ng4LoadingSpinnerService.hide();
        });
    }

    inviteUser() {

        document.getElementById('adminMenu').style.display = 'none';
        if (this.inviteAdminForm.invalid) {
            this.toastrService.warning('Invite', 'Enter Email address');
            return;
        }
        this.admin_password = this.makepass();
        const inviteData = {
            email: this.inviteAdminForm.value.email,
            pass: this.admin_password
        };

        this.employeesService.sendInvitationUser(inviteData).subscribe((res: any) => {
            if (res && !res.status && res.message) {
                this.toastrService.warning('Invite', res.message);
            } else {
                this.authService.signUpRegular(inviteData.email, inviteData.pass).then(data => {
                    this.toastrService.success('Invite', 'Success');
                    this.inviteAdminForm.reset();
                    $('#inviteAdminModal').modal('hide');
                })
                    .catch(err => {
                        this.toastrService.warning('Invite', 'Internal server error');
                    });

            }
        }, (err) => {
            this.toastrService.warning('Invite', 'Internal server error');
        });
    }

    removeAssignment(assignment) {
        this.bookService.removeAssignmentFromGroup({
            GROUP_ID: this.selectedGroup.ID,
            LESSON_ID: assignment.lesson_id
        }).subscribe((res: any) => {
            if (res.data && res.data.deleted_assignments && res.data.deleted_assignments.length > 0) {
                const assignmentIds = res.data.deleted_assignments.filter((item: any) => {
                    if (item.res && item.res.status) {
                        return true;
                    }
                }).map((item: any) => {
                    return item.res.deleted;
                });


                if (assignmentIds.length > 0) {
                    this.toastrService.success('Assignment deleted');

                    this.assignments = this.assignments.filter((a: Assignment) => {
                        return !(assignmentIds.indexOf(a.assignment_id) > -1);
                    });
					this.selectedAssignment = {
                            "assignment_id": -1,
                            "NAME": "No assignments",
                            "START_DATE": null,
                            "DUE_DATE": null,
                            "NOTES": "",
                            "book_id": -1,
                            "lesson_id": -1,
                            "TIME_TO_COMPLETE": 0
                        };
                    if (this.assignments.length == 0) {
                        this.assignments = [{
                            "assignment_id": -1,
                            "NAME": "No assignments",
                            "START_DATE": null,
                            "DUE_DATE": null,
                            "NOTES": "",
                            "book_id": -1,
                            "lesson_id": -1,
                            "TIME_TO_COMPLETE": 0
                        }];
                        //this.selectedAssignment = this.assignments[0];
						this.editAssignmentValues = {'START_DATE' : this.selectedAssignment.START_DATE, 'DUE_DATE' : this.selectedAssignment.DUE_DATE, 'MINUTES' : this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS' : this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES' : this.selectedAssignment.NOTES};

                        this.countdown = new Date(1970, 0, 1).setSeconds(this.selectedAssignment.TIME_TO_COMPLETE);
                    }



                    for (let j = 0; j < this.dataObj.selectedBook.LESSONS.length; j++) {
                        if (this.dataObj.selectedBook.LESSONS[j].ID === assignment.lesson_id) {
                            this.dataObj.selectedBook.LESSONS[j].removeAssingGroup(this.selectedGroup.ID);
                        }
                    }
                }
            }


        }, (err) => {
            this.toastrService.warning('Whoops, something went wrong!');
        });
    }

    onPdfLoadError(event) {
        this.toastrService.warning('PDF', 'Pdf does not have data');
        this.testPdf = null;
        console.log('onPdfLoadError event', event);
    }

    generateLessonPlan(pdf: PDFDocumentProxy) {
        let self = this;
        // loop through table of contents to automatically generate a lesson plan for a newly uploaded book
        if (this.newBookAdded) {
            var maxPages = pdf.numPages;
            var countPromises = []; // collecting all page promises
            for (var j = 1; j <= maxPages; j++) {
                var page = pdf.getPage(j);
                var txt = "";
                countPromises.push(page.then(function (page) { // add page promise
                    var textContent = page.getTextContent();
                    return textContent.then(function (text) { // return content promise
                        return text.items.map(function (s) { return s.str; }); // value page text
                    });
                }));
            }
            // Wait for all pages and join text
            return Promise.all(countPromises).then(function (texts) {
                if (!self.dataObj.selectedBook.LESSONS) {
                    self.dataObj.selectedBook.LESSONS = [];
                }
                let titleRegex = /(\d+\.?\d*)[\s\–]+(\w+(\-| |\(|\))*)+/g,
                    titleSecondLineRegex = /^(?!Section)((\D\s*\w+)(\-| )*)+/g,
                    elipsesRegex = /^( *\.){2,}/g,
                    pageNumberRegex = /^\d+ ?(?!\.)/;
                    
                let lessons = [];
                let lesson = {};
                let title = "";
                let lessonFinished = false, endOfIndex = false, indexStarted = false;
                for (var i = 0; i < texts.length; i++) {
                    //scan pages
                    if (endOfIndex) {
                        break;
                    }
                    for (var j = 0; j < texts[i].length; j++) {
                        //scan word groups
                        let textSnippet = texts[i][j];
                        if (textSnippet == 'TABLE OF CONTENTS') {
                            indexStarted = true;
                        } else if (textSnippet == "Index") {
                            endOfIndex = true;
                        } else if (indexStarted) {
                            if (lessonFinished) {
                                //lesson object complete
                                lessons.push(lesson);
                                lesson = {};
                                lessonFinished = false;
                            }
                            if (titleRegex.test(textSnippet)) {
                                //section title found
                                title = "Section " + textSnippet.match(titleRegex);
                                while (title.endsWith(' ')) {
                                    title = title.substring(0, title.length - 1);
                                }
                                lesson['title'] = title;
                            } else if (titleSecondLineRegex.test(textSnippet)) {
                                //second line in title found
                                lesson['title'] += " " + textSnippet.match(titleSecondLineRegex);
                            } else if (pageNumberRegex.test(textSnippet)) {
                                //start page found
                                while (textSnippet.endsWith(' ')) {
                                    textSnippet = textSnippet.substring(0, textSnippet.length - 1);
                                }
                                lesson['startPage'] = parseInt(textSnippet);
                                lessonFinished = true;
                                if (lessons.length > 1) {
                                    //set end page of the previous lesson in the list
                                    lessons[lessons.length - 1].endPage = (lesson['startPage'] == lessons[lessons.length - 1].startPage) ? lesson['startPage'] : lesson['startPage'] - 1;
                                    if (endOfIndex) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                for (let i = 0; i < lessons.length; i++) {
                    self.dataObj.selectedBook.LESSONS.push(new Lesson(null, lessons[i].title, self.dataObj.selectedBook.ID, lessons[i].startPage, lessons[i].endPage, ''));
                }
                ()=>this.saveLessons();
            });
        }
    }
    getLessonPlan() {
        return this
    }
    onChangeBook(event) {
        let book = this.selectedBook;
        if (book) {
            this.dataObj.books.forEach(element => {
                if (element.ID == book){
                    this.dataObj.selectedBook = element;     
                }
            });
            
            //set active book
            const formData: FormData = new FormData();
            formData.append('book_id', this.selectedBook.toString());
            formData.append('group_id', this.selectedGroup.ID.toString());
            this.bookService.setActiveBook(formData).subscribe((res)=>{
                console.log(res);
            });
           // console.log(formData);
            this.testPdf = {
                url: `${this.bookService._api.endpoint}/read-pdf?path=${this.dataObj.selectedBook.PDF_FILE}`,
                withCredentials: false
            };
        }
        this.dataObj.selectedLesson = null;
        // this.refreshBookLessons(this.selectedBook);
        // $('#beforeChangePageOrBook').modal();
    }

    togglePdfPreview() {
        console.log('toggle preview');
        if (this.viewPdf) {
            this.viewPdf = false;
            document.getElementById('thirdColumn').className = 'col-xl-10';
            document.getElementById('fourthColumn').className = 'col-xl-0';
            document.getElementById('fourthColumn').style.display = 'none';
        } else {
            this.viewPdf = true;
            this.viewAssignments = false;
            document.getElementById('secondColumn').className = 'col-xl-0';
            document.getElementById('thirdColumn').className = 'col-xl-6';
            document.getElementById('fourthColumn').className = 'col-xl-4';
            document.getElementById('fourthColumn').style.display = 'block';
        }
    }

    loadAssignmentPreview() {
        /*
        let lesson;
        let book = [];
         for (let i = 0; i < this.dataObj.books.length; i++) {
            if (this.dataObj.books[i].ID === this.selectedAssignment.book_id) {
                book.push(this.dataObj.books[i]);

                for (let j = 0; j < this.dataObj.books[i].LESSONS.length; j++) {
                    if (this.dataObj.books[i].LESSONS[j].ID === this.selectedAssignment.lesson_id) {
                        lesson = this.dataObj.books[i].LESSONS[j];
                    }
                }
            }
        } */

        let lesson;
        for (let j = 0; j < this.dataObj.book.LESSONS.length; j++) {
            if (this.dataObj.book.LESSONS[j].ID === this.selectedAssignment.lesson_id) {
                lesson = this.dataObj.book.LESSONS[j];
            }
        }

        this.previewPdf = {
            url: `${this.bookService._api.endpoint}/read-pdf?path=${this.dataObj.book.PDF_FILE}`,
            withCredentials: false
        };

        this.pdfCurrentPagePreviewMax = this.dataObj.book.TOTAL_PAGES + "";
        this.pdfCurrentPagePreview = lesson.START_PAGE + "";
    }

    changedPdfPageNoPreview(pageNo: any) {
        console.log('change');
        /*
        if (pageNo != null && pageNo !== '' && pageNo <= this.dataObj.selectedBook.TOTAL_PAGES) {
            this.pdfCurrentPage = pageNo;
        }
        */
    }

    incrementPagePreview() {
        console.log('inc');
        this.pdfCurrentPagePreview = String(Number(this.pdfCurrentPagePreview) + 1);
    }

    decrementPagePreview() {
        console.log('dec');
        this.pdfCurrentPagePreview = String(Number(this.pdfCurrentPagePreview) - 1);
    }

    changePdfPageNo(pageNo: any) {
        if (pageNo != null && pageNo !== '' && pageNo <= this.dataObj.selectedBook.TOTAL_PAGES) {
            this.pdfCurrentPage = pageNo;
        }
    }

    saveLessons(): void {
        const new_lessons: any[] = this.dataObj.selectedBook.LESSONS.filter((item: Lesson) => {
            let validation = item.NAME != '' && item.START_PAGE > 0 && item.END_PAGE > 0;
            if ((item.changed_state && item.validationCheck(this.dataObj.selectedBook.TOTAL_PAGES) && validation) || (item.ID == null && validation)) {
                return true;
            } else {
                return false;
            }
        }).map((item) => {
            return {
                ID: item.ID,
                NAME: item.NAME,
                action: item.ID ? 'existing' : 'new',
                BOOK_ID: item.BOOK_ID,
                BOOK_FILE_PDF: this.dataObj.selectedBook.PDF_FILE,
                END_PAGE: item.END_PAGE == null ? 0 : item.END_PAGE,
                PDF_FILE: item.PDF_FILE,
                START_PAGE: item.START_PAGE == null ? 0 : item.START_PAGE
            };
        });

        console.log(new_lessons);
        const data = {
            lessons: new_lessons,
            group_id: this.selectedGroup.ID,
            book_id: this.dataObj.selectedBook.ID,
        };

        if (new_lessons.length > 0) {
            this.bookService.batchSaveLesson(data).subscribe((lessonsRes: any) => {

                console.log(lessonsRes);
                let newLessons = lessonsRes.results.filter(item => item.action == 'new').map((item: Lesson) => {
                    return this.transformLessonModel(item);
                });

                let updatedLessons = lessonsRes.results.filter(item => item.action == 'exsting').map((item: Lesson) => {
                    return this.transformLessonModel(item);
                });

                console.log(this.dataObj.selectedBook.LESSONS);
                console.log(newLessons);

                this.dataObj.selectedBook.LESSONS = [
                    ...this.dataObj.selectedBook.LESSONS.filter((lesson) => lesson.ID != null),
                    ...newLessons
                ];

                this.dataObj.selectedBook.LESSONS.forEach((item, key) => {
                    updatedLessons.forEach((editLesson, eKey) => {
                        if (item.ID == editLesson.ID) {
                            this.dataObj.selectedBook.LESSONS[key] = editLesson;
                        }
                    });
                });

                this.toastrService.success('Lesson', 'Saved');


                // this.refreshBookLessons(this.selectedBook);
            });
        } else {
            this.toastrService.warning('Lesson', 'Enter proper data');
        }
    }


      saveDeleteLessons (remove) {
        console.log('save delete Lessons');
        this.bookService.deleteLessons(remove).subscribe((res: any) => {});
      }
    /* saveDeleteLessons(): void {
      const new_lessons: any[] = this.dataObj.selectedBook.LESSONS.filter((item: Lesson) => {
          let validation = item.NAME != '' && item.START_PAGE > 0 && item.END_PAGE > 0;
          if ((item.changed_state && item.validationCheck(this.dataObj.selectedBook.TOTAL_PAGES) && validation) || (item.ID == null && validation)) {
              return true;
          } else {
              return false;
          }
      }).map((item) => {
          return {
              ID: item.ID,
              NAME: item.NAME,
              action: item.ID ? 'existing' : 'new',
              BOOK_ID: item.BOOK_ID,
              BOOK_FILE_PDF: this.dataObj.selectedBook.PDF_FILE,
              END_PAGE: item.END_PAGE == null ? 0 : item.END_PAGE,
              PDF_FILE: item.PDF_FILE,
              START_PAGE: item.START_PAGE == null ? 0 : item.START_PAGE
          };
      });

      const data = {
          lessons: new_lessons,
          group_id: this.selectedGroup.ID,
          book_id: this.dataObj.selectedBook.ID,
      };

          this.bookService.batchSaveLesson(data).subscribe((lessonsRes: any) => {

              let newLessons = lessonsRes.results.filter(item => item.action == 'new').map((item: Lesson) => {
                  return this.transformLessonModel(item);
              });

              let updatedLessons = lessonsRes.results.filter(item => item.action == 'exsting').map((item: Lesson) => {
                  return this.transformLessonModel(item);
              });


              this.dataObj.selectedBook.LESSONS = [
                  ...this.dataObj.selectedBook.LESSONS.filter((lesson) => lesson.ID != null),
                  ...newLessons
              ];

              this.dataObj.selectedBook.LESSONS.forEach((item, key) => {
                  updatedLessons.forEach((editLesson, eKey) => {
                      if (item.ID == editLesson.ID) {
                          this.dataObj.selectedBook.LESSONS[key] = editLesson;
                      }
                  });
              });

              this.toastrService.success('Lesson', 'Saved');


              // this.refreshBookLessons(this.selectedBook);
          });

    }
 */
    deleteLessons(): void {
       // let remove = [];
        const remove: any[] = this.dataObj.selectedBook.LESSONS.filter((item: Lesson) => {
            console.log(item);
            let validation = item.is_checked;
            if (validation && item.ID != null ) {
                console.log(item);
                return true;
            } else {
                return false;
            }
        }).map((item) => {
            return {
                ID: item.ID,
            };
        });
        console.log(remove);

        this.bookService.deleteLessons(remove).subscribe((res: any) => {

            //this.dataObj.selectedBook.LESSONS = res.results;
            this.dataObj.selectedBook.LESSONS = this.dataObj.selectedBook.LESSONS.filter((item: Lesson) => {
                console.log(item);
                let validation = !item.is_checked;
                if (validation) {
                    console.log(item);
                    return true;
                } else {
                    return false;
                }
            });

            /* let updatedLessons = res.results.filter(item => !item.is_checked).map((item: Lesson) => {
                return this.transformLessonModel(item);
            });

            if (this.dataObj.selectedBook.LESSONS) {
                const lessionIds = this.dataObj.selectedBook.LESSONS.filter((item) => item.is_checked == true && item.ID != null).map(item => item.ID);
                this.dataObj.selectedBook.LESSONS = this.dataObj.selectedBook.LESSONS.filter((item) => item.is_checked == false);
            } */
        });
    }

    incrementPage() {
        this.pdfCurrentPage = String(Number(this.pdfCurrentPage) + 1);

    }

    decrementPage() {
        this.pdfCurrentPage = String(Number(this.pdfCurrentPage) - 1);

    }

    setStartPage() {
        this.pdfStartPage = Number(this.pdfCurrentPage);
        if (this.pdfStartPage > this.pdfEndPage) {
            this.pdfEndPage = this.pdfStartPage;
        }
    }

    setEndPage() {
        this.pdfEndPage = Number(this.pdfCurrentPage);
        if (this.pdfEndPage < this.pdfStartPage) {
            this.pdfStartPage = this.pdfEndPage;
        }
    }

    emailConfirm() {
        this.employeesService.email(this.modalEmails, this.emailContents).subscribe(data => {

        });
    }

    emailGroup() {
        this.modalEmails = this.employees.map(employee => employee.EMAIL).reduce(function (total, next) {
            return total + "," + next
        });
		console.log(this.modalEmails);
    }

    emailGroupIncomplete() {
		if(this.employees !== []){
			if(this.employees[0].IS_COMPLETE != null){
				this.modalEmails = this.employees.map(employee => employee.IS_COMPLETE.data[0] === 0 ? employee.EMAIL : '').reduce(function (total, next) {
					return next !== '' ? total + ", " + next : total;
				});
			}
			else{
				this.modalEmailsIncomplete = "";
			}
		}
		else{
			this.modalEmailsIncomplete = "";
		}

    }

    emailGroupLate(text) {
        console.log(text);
        console.log(this.emailContents);
    }

    groupSelect(group) {
        this.sortAscending = true;
        this.sortDescending = true;
		if(this.selectedGroup !== undefined && this.selectedGroup !== null){
			if (group.ID == this.selectedGroup.ID) {
				return;
			}
		}
        this.selectedGroup = group;
        this.newBookAdded = false;
        this.transformResponseAndPopulate();
        this.employeesService.getAssignments(group.ID).subscribe(data2 => {
            if (!data2['err']) {
                if (typeof (data2[0]) === undefined) {
                    this.assignments = [];
                    this.selectedAssignment = null;
                    this.employees = [];
                } else {
                    this.assignments = data2;
                    this.selectedAssignment = data2[0];
					this.editAssignmentValues = {'START_DATE' : this.selectedAssignment.START_DATE, 'DUE_DATE' : this.selectedAssignment.DUE_DATE, 'MINUTES' : this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS' : this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES' : this.selectedAssignment.NOTES};

                    this.countdown = new Date(1970, 0, 1).setSeconds(this.selectedAssignment.TIME_TO_COMPLETE);
                    this.employeesService.getEmployees(this.selectedGroup.ID, this.selectedAssignment.assignment_id).subscribe(data3 => {
                        this.employees = data3;

                        let complete = 0;
                        let total = data3.length;
                        for (let i = 0; i < data3.length; i++) {
                            console.log(data3[i]);
                            if (data3[i].IS_COMPLETE !== null) {
                                if (data3[i].IS_COMPLETE.data[0] === 1) {
                                    complete = complete + 1;
                                }
                            }
                        }

                        if (complete === 0) {
                            this.selectedAssignmentCompletion = 0 + "%";
                        } else {
                            this.selectedAssignmentCompletion = Math.floor((complete / total) * 100) + "%";
                        }
						this.emailGroup();
						this.emailGroupIncomplete();
                    });
                }
				
            } else {
                this.assignments = [{
                    "assignment_id": -1,
                    "NAME": "No assignments",
                    "NOTES": "",
                    "START_DATE": null,
                    "DUE_DATE": null,
                    "book_id": -1,
                    "lesson_id": -1,
                    "TIME_TO_COMPLETE": 0
                }];
                this.selectedAssignment = this.assignments[0];
				this.editAssignmentValues = {'START_DATE' : this.selectedAssignment.START_DATE, 'DUE_DATE' : this.selectedAssignment.DUE_DATE, 'MINUTES' : this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS' : this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES' : this.selectedAssignment.NOTES};

                this.countdown = new Date(1970, 0, 1).setSeconds(this.selectedAssignment.TIME_TO_COMPLETE);
                this.employeesService.getEmployees(group.ID, -1).subscribe(data3 => {
                    this.employees = data3;

                    let complete = 0;
                    let total = data3.length;
                    for (let i = 0; i < data3.length; i++) {
                        if (data3[i].IS_COMPLETE !== null) {
                            if (data3[i].IS_COMPLETE.data[0] === 1) {
                                complete = complete + 1;
                            }
                        }
                    }

                    if (complete === 0) {
                        this.selectedAssignmentCompletion = 0 + "%";
                    } else {
                        this.selectedAssignmentCompletion = Math.floor((complete / total) * 100) + "%";
                    }
					
					this.emailGroup();
					this.emailGroupIncomplete();

                });
            }

            // const my_this = this; //needed for filter function

            // this.potentialAssignments = this.lessons.filter(function (lesson) {
            //     for (var i = 0; i < my_this.assignments.length; ++i) {
            //         if (my_this.assignments[i].lesson_id == lesson.ID) {
            //             return false;
            //         }
            //     }
            //     ;
            //     return true;
            // });
            // console.log(this.potentialAssignments);
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
        if (assignmentButton == null || assignmentButton == undefined) {
            assignmentButton = document.getElementById('assignmentButtonActive');
        }
        if (lessonButton == null || lessonButton == undefined) {
            lessonButton = document.getElementById('lessonButtonActive');
        }

        if (selected === "assignments") {
            this.viewLessons = false;
            lessonButton.id = 'lessonButton';
            if (this.viewAssignments) {
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
            if (this.viewLessons) {
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

        this.viewPdf = false;
        document.getElementById('fourthColumn').className = 'col-xl-0';
        document.getElementById('fourthColumn').style.display = 'none';
    }

    assignmentSelect(assignment, index) {
        console.log(assignment);
        this.countdown = new Date(1970, 0, 1).setSeconds(assignment.TIME_TO_COMPLETE);
        let assignments = document.getElementsByClassName('assignment-summary');
        for (let i = 0; i < assignments.length; i++) {
            if (index == i) {
                assignments[i].className = 'assignment-summary assignment-summary-selected';
            } else {
                assignments[i].className = 'assignment-summary';
            }
        }
        this.selectedAssignment = assignment;
		this.editAssignmentValues = {'START_DATE' : this.selectedAssignment.START_DATE, 'DUE_DATE' : this.selectedAssignment.DUE_DATE, 'MINUTES' : this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS' : this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES' : this.selectedAssignment.NOTES};

        this.countdown = new Date(1970, 0, 1).setSeconds(this.selectedAssignment.TIME_TO_COMPLETE);
        this.employeesService.getEmployees(this.selectedGroup.ID, assignment.assignment_id).subscribe(data3 => {
            this.employees = data3;

            let complete = 0;
            let total = data3.length;
            for (let i = 0; i < data3.length; i++) {
                if (data3[i].IS_COMPLETE !== null) {
                    if (data3[i].IS_COMPLETE.data[0] === 1) {
                        complete = complete + 1;
                    }
                }
            }

            if (complete === 0) {
                this.selectedAssignmentCompletion = 0 + "%";
            } else {
                this.selectedAssignmentCompletion = Math.floor((complete / total) * 100) + "%";
            }

        });
        this.loadAssignmentPreview();
    }

    editAssignment() {
        console.log("edit");
        console.log(this.selectedAssignment);
        /* var date = new Date(this.selectedAssignment.START_DATE);
        var month = (date.getMonth() + 1);
        var monthString = "";
        if (month < 10) {
            monthString = "0" + month;
        }
        var day = date.getDate();
        var dayString = "";
        if (day < 10) {
            dayString = "0" + day;
        }
        var year = date.getFullYear();
        var yearString = "" + year;
        var dateString = yearString + '-' + monthString + '-' + dayString;
        (<HTMLInputElement>document.getElementById('startDateEdit')).value = dateString;


        date = new Date(this.selectedAssignment.DUE_DATE);
        month = (date.getMonth() + 1);
        if (month < 10) {
            monthString = "0" + month;
        }
        day = date.getDate();
        if (day < 10) {
            dayString = "0" + day;
        }
        year = date.getFullYear();
        yearString = "" + year;
        dateString = yearString + '-' + monthString + '-' + dayString;
        (<HTMLInputElement>document.getElementById('dueDateEdit')).value = dateString;

        var minutes = (Math.floor(this.selectedAssignment.TIME_TO_COMPLETE / 60));
        var seconds = this.selectedAssignment.TIME_TO_COMPLETE - (minutes * 60);

        var minuteString = minutes + "";
        var secondString = seconds + "";
        (<HTMLInputElement>document.getElementById("minutesEdit")).value = minuteString;
        (<HTMLInputElement>document.getElementById("secondsEdit")).value = secondString;

        var notes = this.selectedAssignment.NOTES;
        if (notes !== undefined && notes !== null && notes != "") {
            (<HTMLInputElement>document.getElementById("notesInputEdit")).value = notes;
        } */
		this.editAssignmentValues = {'START_DATE' : this.selectedAssignment.START_DATE, 'DUE_DATE' : this.selectedAssignment.DUE_DATE, 'MINUTES' : this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS' : this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES' : this.selectedAssignment.NOTES};
		console.log(this.editAssignmentValues);
	}

    updateAssignment() {
        let minute = parseInt((<HTMLInputElement>document.getElementById("minutesEdit")).value);
        let seconds = "0";
        var secondsInt = 0;
        if ((<HTMLInputElement>document.getElementById("secondsEdit")).value !== null && (<HTMLInputElement>document.getElementById("secondsEdit")).value !== undefined) {
            secondsInt = parseInt((<HTMLInputElement>document.getElementById("secondsEdit")).value);
        }
        let time_to_complete = (minute * 60) + secondsInt;

        let notes = (<HTMLInputElement>document.getElementById("notesInputEdit")).value;
        let start_date = new Date((<HTMLInputElement>document.getElementById('startDateEdit')).value);
        let due_date = new Date((<HTMLInputElement>document.getElementById('dueDateEdit')).value);

		console.log(notes);

		start_date.setDate(start_date.getDate());
		due_date.setDate(due_date.getDate());
		
		var display_start_date = new Date(start_date);
		var display_due_date = new Date(due_date);
		
		display_start_date.setDate(display_start_date.getDate() + 1);
		display_due_date.setDate(display_due_date.getDate() + 1);

		console.log(start_date);
		console.log(display_start_date);

        const dataForm = {
            assignment_id: this.selectedAssignment.assignment_id,
            NAME: this.selectedAssignment.NAME,
            LESSON_ID: this.selectedAssignment.lesson_id,
            BOOK_ID: this.selectedAssignment.book_id,
            GROUP_ID: this.selectedGroup.ID,
            NOTES: notes,
            DUE_DATE: due_date.toISOString().substring(0, 19).replace('T', ' '),
            START_DATE: start_date.toISOString().substring(0, 19).replace('T', ' '),
            TIME_TO_COMPLETE: time_to_complete
        };

        let assign: Assignment = {
            NAME: this.selectedAssignment.NAME,
            lesson_id: this.selectedAssignment.lesson_id,
            book_id: this.selectedAssignment.book_id,
            DUE_DATE: display_due_date,
            START_DATE: display_start_date,
            TIME_TO_COMPLETE: time_to_complete,
            assignment_id: this.selectedAssignment.assignment_id,
            NOTES: notes
        };
        if (notes !== null && notes !== undefined && notes != "") {
            assign.NOTES = notes;
        }

		console.log(assign);
		console.log(dataForm);

        for (let i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].assignment_id == assign.assignment_id) {
                this.assignments[i] = assign;
            }
        }

        this.selectedAssignment = assign;
		console.log(this.selectedAssignment.NOTES);
		this.editAssignmentValues = {'START_DATE' : this.selectedAssignment.START_DATE, 'DUE_DATE' : this.selectedAssignment.DUE_DATE, 'MINUTES' : this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS' : this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES' : this.selectedAssignment.NOTES};

        this.bookService.editAssignment(this.selectedAssignment.assignment_id, dataForm).subscribe((res: any) => {
            console.log('complete');
			this.employeesService.getEmployees(this.selectedGroup.ID, this.selectedAssignment.assignment_id).subscribe(data3 => {
				this.employees = data3;
				let complete = 0;
				let total = data3.length;
				for (let i = 0; i < data3.length; i++) {
					//console.log(data3[i]);
					if (data3[i].IS_COMPLETE !== null) {
						if (data3[i].IS_COMPLETE.data[0] === 1) {
							complete = complete + 1;
						}
					}
				}
				this.selectedAssignment.percent_complete = complete / total;
			});
        });

    }

    lessonSelect(lesson) {
        this.dataObj.selectedLesson = lesson;
    }

    toggle(lesson) {
        console.log('toggle start');
        lesson.toggle();
        let show = false;
        for (let i = 0; i < this.dataObj.selectedBook.LESSONS.length; i++) {
            if (this.dataObj.selectedBook.LESSONS[i].is_checked) {
                show = true;
            }
        }
        if (show) {
            document.getElementById('deleteLessonButton').className = 'btn btn-primary show';
        } else {
            document.getElementById('deleteLessonButton').className = 'btn btn-primary';
        }
        console.log('toggle end');
    }

    toggleSort() {
        console.log('toggling sorting direction');
        console.log(this.sortAscending);
        console.log(this.sortDescending);
        console.log(this.assignments);

        let sortDesc = function compare(a, b) {
            if (a.DUE_DATE < b.DUE_DATE) {
                return -1;
            }
            if (a.DUE_DATE > b.DUE_DATE) {
                return 1;
            }
            // a must be equal to b
            return 0;
        }

        let sortAsc = function compare(a, b) {
            if (a.DUE_DATE > b.DUE_DATE) {
                return -1;
            }
            if (a.DUE_DATE < b.DUE_DATE) {
                return 1;
            }
            // a must be equal to b
            return 0;
        }

        if (this.sortDescending) {
            this.assignments.sort(sortAsc);
            this.sortAscending = true;
            this.sortDescending = false;
        } else {
            this.assignments.sort(sortDesc);
            this.sortAscending = false;
            this.sortDescending = true;
        }
    }

    signInWithEmail() {
        console.log(1);
		this.ng4LoadingSpinnerService.show();
        this.authService.signInRegular(this.userEmail, this.userPassword)
            .then((res) => {
                this.employeesService.getUserByEmail(this.userEmail).subscribe((res2) => {
                    if (res2[0] == undefined) {
                        this.loginErrorMessage = "You are not in the website database. If you received an email invitation, but get this error, something went wrong. Please contact an administrator";
                        this.isLoginError = true;
                        //this.isLoggedIn = true;
						this.ng4LoadingSpinnerService.hide();
                        console.log(2);
                    }
                    else {
                        console.log(3);
                        this.firstName = res2[0]['FIRST_NAME'];
                        this.lastName = res2[0]['LAST_NAME'];


                        if (res2[0]['FIRST_NAME'] == '' || res2[0]['FIRST_NAME'] == null || res2[0]['FIRST_NAME'] == undefined) {
                            this.isLoginError = false;
                            this.newUser = true;
                            setTimeout(function() {
                              $('#newUserPhoneNumber').keyup(function(){
                                $(this).val($(this).val().replace(/(\d{3})\-?(\d{3})\-?(\d{4})/,'($1) - $2 - $3'))
                              });
                            }, 10);

							this.ng4LoadingSpinnerService.hide();
                            console.log(4);
                        }
                        else {
                            console.log(5);
                            if (res2[0]['IS_ADMIN']['data'][0] == 1) {
                                this.admin_id = res2[0]['ID']; //Hardcode since groups shouldnt care about admin ids
                                this.onAdminLogin(this.admin_id);//HARDCODE FOR TESTING
                                //this.onAdminLogin(this.admin_id);
                                this.isLoggedIn = true;
                                console.log(6);
                            }
                            else {
                                //console.log(res2[0]['IS_ADMIN']);
                                //console.log(this.admin_id);
                                //Employee Login logic occurs
                                this.admin_id=0;
                                this.isLoggedIn = true;
                                this.newUser = false;
								this.ng4LoadingSpinnerService.hide();
                                console.log(7);
                            }
                        }
                    }
                }, (err2) => {
                    this.loginErrorMessage = err2;
                    this.isLoginError = true;
					this.ng4LoadingSpinnerService.hide();
                });
                //*/
				/*
				this.employeesService.getAdminID(this.userEmail).subscribe((res2) => {
					if(res2[0] == undefined){
						//this.loginErrorMessage = "You are not an admin";
						//this.isLoginError = true;
						this.isLoggedIn = true;
					}
					else{
						this.admin_id = res2[0]['ID'];
						console.log(this.admin_id)
						this.onAdminLogin(this.admin_id);
						this.isLoggedIn = true;
					}
				},
				(err) => {
					this.loginErrorMessage = "Internal server error, please contact an admin: " + err;
					this.isLoginError = true;
				})
				//*/

            })
            .catch((err) => {
                this.loginErrorMessage = err;
                this.isLoginError = true;
				this.ng4LoadingSpinnerService.hide();
            });
    }

    getApk() {
        this.employeesService.getApk().subscribe(
            data => saveAs(data, "SafetyTraining.apk"),
            error => console.log(error)
        );
    }

    signInFirstTime() {
        console.log(this.newUserFirstName);
        console.log(this.newUserLastName);
        console.log(this.newPassword == this.confirmPassword);

        if (this.newUserFirstName == "") {
            this.loginErrorMessage = "First name cannot be empty";
            this.isLoginError = true;
        }
        else if (this.newUserLastName == "") {
            this.loginErrorMessage = "Last name cannot be empty";
            this.isLoginError = true;
        }
        else if (this.newPassword == "") {
            this.loginErrorMessage = "Password cannot be empty";
            this.isLoginError = true;
        }
        else if (this.newPassword != this.confirmPassword) {
            this.loginErrorMessage = "Passwords must match";
            this.isLoginError = true;
        }
        else if (this.newUserPhoneNumber.replace(/\D/g,'').length != 10) {
            this.loginErrorMessage = "Please enter a valid phone number (exactly 10 numbers)";
            this.isLoginError = true;
        }
        else {
            this.authService.updateUserNames(this.newUserFirstName, this.newUserLastName, this.newPassword, this.newUserPhoneNumber.replace(/\D/g,'')).then
            ((ret) => {

                this.newUserObject = ret;
                console.log({"newUser": this.newUserObject});
                this.newUserError = this.newUserObject['error'];
                console.log({"Error": this.newUserError});
                console.log({"affectedRows": this.newUserObject['affectedRows']});


                if (this.newUserObject['affectedRows'] != 1) {
                    this.loginErrorMessage = "Internal server error. Please contact an administrator";
                    console.log(this.newUserError);
                    this.isLoginError = true;
                }
                else {
                    this.loginErrorMessage = "Success!";
                    console.log(this.loginErrorMessage);
                    this.isLoginError = true;
                    this.userPassword = this.newPassword;
                    this.signInWithEmail();
                }
                console.log(this.loginErrorMessage);
            },
            (err) => {
				this.loginErrorMessage = "Issue with authentication server. Please refresh this page and try again.";
				this.isLoginError = true;
                console.log(err);
            }
    )

        }

    }

	resetPassword(){
		this.authService.resetPassword(this.userEmail)
			.subscribe((res) => {
				this.loginErrorMessage = 'Password has been reset. Check your email!';
				this.isLoginError = true;
			}, (err) => {
				this.loginErrorMessage = 'Could not send password reset. Ensure email address is correct.';
				this.isLoginError = true;
			});
	}

	changePassword(){

	}

    logout() {
        this.userEmail = "";
		this.userPassword = "";
		this.authService.logout();
        this.loginErrorMessage = "";
        this.isLoginError = false;
        this.isLoggedIn = false;
    }

    ngOnInit() {

        this.selectedGroup = this.groups[0];

    }

}
