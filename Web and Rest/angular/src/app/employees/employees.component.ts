import {Component, OnInit} from '@angular/core';
import {Validators} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {EmployeesService} from '../employees.service';
import {Employee} from '../employee';
import {Assignment} from '../assignment';
import {Group} from '../group';
import {Book, BookNew} from '../book';
import {Lesson} from '../lesson';
import {BookService} from "../book.service";
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../auth.service';

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
        selectedBook: null,
        selectedLesson: null,
        selectedAssignment: null,
    };


    userEmail: string;
    userPassword: string;
    isLoggedIn = false;
    testEmployee: Employee;
    employees: Employee[];
    groups: Group[];
    books: any;
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

    bookGroupForm: FormGroup;
    assignmentGroupForm: FormGroup;
    employeeForm: FormGroup;

    bookForm: any = null;
    groupForm: any = FormGroup;
    inviteAdminForm: any = FormGroup;
    assignmentForm: any = null;

    private bookService: BookService;

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
                bookService: BookService, fb: FormBuilder) {

        this.fb = fb;
        this.employeesService = employeesService;
        this.bookService = bookService;
        this.authService = authService;
        this.toastrService = toastrService;

        this.userEmail = '';
        this.userPassword = '';
        this.employees = [];
        this.groups = [];
        this.assignments = [];
        this.books = [];
        this.potentialAssignments = [];

        this.pdfCurrentPage = "1";
        this.bookForm = null;
        this.modalEmails = "";
        this.emailContents = "";
        this.lookAtAssignments = true;

        this.resetForm();
        this.reactiveFormGroup();
        this.transformResponseAndPopulate();

        document.getElementsByTagName('body')[0].style.backgroundColor = '#89CFF0';


        employeesService.getGroups(this.admin_id).subscribe(groups => {
            this.groups = groups;
            this.selectedGroup = groups[0] || null;

            employeesService.getAssignments(this.selectedGroup.ID).subscribe(assignments => {

                if (assignments && assignments.hasOwnProperty('err')){
                    this.assignments = [{
                                        "assignment_id": -1,
                                        "NAME": "No assignments",
                                        "START_DATE": null,
                                        "DUE_DATE": null,
                                        "book_id": -1,
                                        "lesson_id": -1
                                    }];
                    this.selectedAssignment = assignments[0];
                                    if (this.selectedGroup && this.selectedAssignment){
                                        employeesService.getEmployees(
                                            this.selectedGroup.ID,
                                            -1
                                        ).subscribe(employees => {
                                            this.employees = employees;
                                        });
                                    }
                }else{
                    this.assignments = assignments;
                    this.selectedAssignment = assignments[0];
                                    if (this.selectedGroup && this.selectedAssignment){
                                        employeesService.getEmployees(
                                            this.selectedGroup.ID,
                                            this.selectedAssignment.assignment_id
                                        ).subscribe(employees => {
                                            this.employees = employees;
                                        });
                                    }
                }

            });
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

        this.employeesService.getBooks().subscribe(res => {
            const bookMapping = (books: BookNew[], lessons: Lesson[]) => {
                return books.map((book: BookNew) => {
                    book.LESSONS = lessons.filter((lesson: Lesson) => lesson.BOOK_ID == book.ID).map((tempLession: Lesson) => {
                        return this.transformLessonModel(tempLession);
                    });
                    return book;
                });
            };

            this.employeesService.getLessons().subscribe(data => {
                this.dataObj.books = bookMapping(res.books, data);
                this.dataObj.selectedBook = this.dataObj.books[0];
                this.selectedBook = this.dataObj.books[0].ID;
                this.updatePdfBookPreview();
            }, (err) => {
                this.dataObj.books = bookMapping(res.books, []);
                this.dataObj.selectedBook = this.dataObj.books[0];
                this.selectedBook = this.dataObj.books[0].ID;
                this.updatePdfBookPreview();
            });
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
        // this.bookService.getBooks().subscribe((data: any) => {
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

            this.bookService.saveBooks(formData).subscribe((res: any) => {
                    if (res.data && res.data.ID) {
                        const newBook = res.data as BookNew;
                        this.dataObj.books.push(newBook);
                        this.selectedBook = newBook.ID;
                        this.dataObj.selectedBook = newBook;
                        this.updatePdfBookPreview();
                        this.dataObj.selectedLesson = null;
                    }
                    this.toastrService.success('Book', 'Saved');
                    $('#newBookModal').modal('hide');
                },
                (err) => {
                    this.toastrService.success('Book', 'Save fail');
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
            LESSON_ID: this.assignmentForm.lesson_id,
            GROUP_ID: this.selectedGroup.ID,
            DUE_DATE: this.assignmentForm.due_date,
            START_DATE: this.assignmentForm.start_date,
            TIME_TO_COMPLETE: this.assignmentForm.time_to_complete
        };
        this.bookService.saveAssignment(this.assignmentForm.lesson_id, dataForm).subscribe((res: any) => {
                console.log('res',res);
                if (res.status && res.data && res.data.ID) {

                    const assign: Assignment = {
                        NAME: name,
                        lesson_id: dataForm.LESSON_ID,
                        book_id: this.dataObj.selectedLesson.BOOK_ID,
                        DUE_DATE: this.assignmentForm.due_date,
                        START_DATE: this.assignmentForm.start_date,
                        assignment_id : res.data.ID
                    };
                    console.log('NEW assignMENT', assign);

                    if (this.assignments.length > 0 && this.assignments[0].assignment_id == -1){
                        this.assignments.splice(0,1);
                    }
                    if (!this.assignments){
                        this.assignments = [];
                    }

                    this.assignments.push(assign);
                    this.selectedAssignment = assign;


                    this.dataObj.selectedBook.LESSONS.forEach((item) => {
                        if (item.ID == dataForm.LESSON_ID) {
                            console.log('itemitem',item);
                            item.setGroup(this.selectedGroup.ID);
                            item.setIsAssigned(true);

                        }
                    });

                    this.assignmentGroupForm.reset();
                    this.resetForm();

                    console.log('this.assignments',this.assignments);
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

    console.log('this.employees',this.employees);

            if (res.employees && res.employees.length > 0 && res.employees[0].ID) {
                this.employeeForm.reset();

                if (res.data.length) {
                    const emp = this.employees.filter((item: Employee) => {
                        return item.ID == res.data[0]['USER_ID'];
                    });
                    if (emp.length == 0){
                        this.employees.push(Object.assign(res.employees[0], {
                           IS_COMPLETE: null
                        }));
                        this.toastrService.success('Employee', 'Saved');
                    }else{
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
        };

        this.bookService.saveGroup(groupData).subscribe((res: any) => {
            if (res && !res.status && res.message) {
                this.toastrService.warning('Group', res.message);
            } else {
                if (res.data && res.data.length > 0) {
                    const  newGroup ={
                        ID : res.data[0].ID,
                        NAME : res.data[0].NAME
                    };
                    this.groups.push(newGroup);
                    this.groupSelect(newGroup);
                }
                this.toastrService.success('Group', 'Saved');
                this.groupForm.reset();
                $('#addGroupModal').modal('hide');
            }
        }, (err) => {
            this.toastrService.warning('Group', 'Internal server error');
        });

    }

    inviteAdmin() {
        if (this.inviteAdminForm.invalid) {
            this.toastrService.warning('Invite', 'Enter Email address');
            return;
        }

        const inviteData = {
            EMAIL: this.inviteAdminForm.value.email,
        };

        this.employeesService.sendInvitation(inviteData).subscribe((res: any) => {
            if (res && !res.status && res.message) {
                this.toastrService.warning('Invite', res.message);
            } else {
                this.toastrService.success('Invite', 'Success');
                this.inviteAdminForm.reset();
                $('#inviteAdminModal').modal('hide');
            }
        }, (err) => {
            this.toastrService.warning('Invite', 'Internal server error');
        });
    }

    removeAssignment(lesson) {
        console.log('lesson',lesson);
        this.bookService.removeAssignmentFromGroup({
            GROUP_ID: this.selectedGroup.ID,
            LESSON_ID : lesson.ID
        }).subscribe((res : any) => {
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

                    this.assignments = this.assignments.filter((a : Assignment) => {
                        return !(assignmentIds.indexOf(a.assignment_id) > -1);
                    });

                    if(this.assignments.length == 0) {
                        this.assignments = [{
                            "assignment_id": -1,
                            "NAME": "No assignments",
                            "START_DATE": null,
                            "DUE_DATE": null,
                            "book_id": -1,
                            "lesson_id": -1
                        }];
                        this.selectedAssignment = this.assignments[0];
                    }
                    lesson.removeAssingGroup(this.selectedGroup.ID);
                }
            }


        }, (err)=>{
            this.toastrService.warning('Whoops, something went wrong!');
        });
    }

    onPdfLoadError(event) {
        this.toastrService.warning('PDF', 'Pdf does not have data');
        this.testPdf = null;
        console.log('onPdfLoadError event', event);
    }

    onChangeBook(event) {
        let book = this.dataObj.books.filter((item) => item.ID == this.selectedBook);
        if (book.length > 0) {
            // this.selectedBookData = book[0];
            this.dataObj.selectedBook = book[0];
            this.testPdf = {
                url: `${this.bookService._api.endpoint}/read-pdf?path=${this.dataObj.selectedBook.PDF_FILE}`,
                withCredentials: false
            };
        }
        this.dataObj.selectedLesson = null;
        // this.refreshBookLessons(this.selectedBook);
        // $('#beforeChangePageOrBook').modal();
    }

    changePdfPageNo(pageNo: any) {
        if (pageNo != null && pageNo !== '' && pageNo <= this.dataObj.selectedBook.TOTAL_PAGES) {
            this.pdfCurrentPage = pageNo;
        }
    }

    saveLessions(): void {
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

        if (new_lessons.length > 0) {
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
        } else {
            this.toastrService.warning('Lesson', 'Enter proper data');
        }
    }

    deleteSelected(): void {
        if (this.dataObj.selectedBook.LESSONS){
            const lessionIds = this.dataObj.selectedBook.LESSONS.filter((item) => item.is_checked == true && item.ID != null).map(item => item.ID);
            this.dataObj.selectedBook.LESSONS = this.dataObj.selectedBook.LESSONS.filter((item) => item.is_checked == false);
            console.log('deleted',lessionIds);
        }
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
        console.log("Email")
        console.log(this.modalEmails);
        console.log(this.emailContents);
        this.employeesService.email(this.modalEmails, this.emailContents).subscribe(data => {

        });
    }

    emailGroup(text) {
        this.modalEmails = this.employees.map(employee => employee.EMAIL).reduce(function (total, next) {
            return total + ", " + next
        });
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
        if (group.ID == this.selectedGroup.ID) {
            return;
        }
        console.log(group.ID);
        this.selectedGroup = group;
        this.employeesService.getAssignments(group.ID).subscribe(data2 => {
            if (!data2['err']) {
                if (typeof(data2[0]) === undefined) {
                    this.assignments = [];
                    this.selectedAssignment = null;
                    this.employees = [];
                } else {
                    this.assignments = data2;
                    this.selectedAssignment = data2[0];
                    this.employeesService.getEmployees(this.selectedGroup.ID, this.selectedAssignment.assignment_id).subscribe(data3 => {
                        this.employees = data3;
                        console.log(data3[0]);

                    });
                }
            } else {
                this.assignments = [{
                    "assignment_id": -1,
                    "NAME": "No assignments",
                    "START_DATE": null,
                    "DUE_DATE": null,
                    "book_id": -1,
                    "lesson_id": -1
                }];
                this.selectedAssignment = this.assignments[0];
                this.employeesService.getEmployees(group.ID, -1).subscribe(data3 => {
                    this.employees = data3;
                    console.log(data3[0]);

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
            console.log(this.books);
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
                document.getElementById('secondColumn').className = 'col-xl-7';
                document.getElementById('thirdColumn').className = 'col-xl-3';
            }
        }
    }

    assignmentSelect(assignment, index) {
        let assignments = document.getElementsByClassName('assignment-summary');
        for (let i = 0; i < assignments.length; i++) {
            if (index == i) {
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

    lessonSelect(lesson) {
        this.dataObj.selectedLesson = lesson;
    }

    signInWithEmail() {
        this.userEmail = 'thebesttestrest@test.rest';
        this.userPassword = 'testtesttest';
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
