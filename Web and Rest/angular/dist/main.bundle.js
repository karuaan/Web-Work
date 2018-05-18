webpackJsonp(["main"],{

/***/ "../../../../../src/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "*{\r\n\tbackground-color: #7E94D5;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<app-employees></app-employees>"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'Admin Console';
    }
    AppComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__("../../../../../src/app/app.component.html"),
            styles: [__webpack_require__("../../../../../src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/esm5/platform-browser.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/esm5/animations.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ngx_chips__ = __webpack_require__("../../../../ngx-chips/esm5/ngx-chips.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ng2_pdf_viewer__ = __webpack_require__("../../../../ng2-pdf-viewer/ng2-pdf-viewer.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__employees_employees_component__ = __webpack_require__("../../../../../src/app/employees/employees.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__employees_service__ = __webpack_require__("../../../../../src/app/employees.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pending_pipe__ = __webpack_require__("../../../../../src/app/pending.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__book_service__ = __webpack_require__("../../../../../src/app/book.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ngx_toastr__ = __webpack_require__("../../../../ngx-toastr/esm5/ngx-toastr.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_angularfire2__ = __webpack_require__("../../../../angularfire2/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_angularfire2_database__ = __webpack_require__("../../../../angularfire2/database/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_angularfire2_auth__ = __webpack_require__("../../../../angularfire2/auth/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_angularfire2_firestore__ = __webpack_require__("../../../../angularfire2/firestore/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__auth_service__ = __webpack_require__("../../../../../src/app/auth.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






 // <-- #1 import module













var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_8__employees_employees_component__["a" /* EmployeesComponent */],
                __WEBPACK_IMPORTED_MODULE_10__pending_pipe__["a" /* PendingPipe */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_12_ngx_toastr__["a" /* ToastrModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_2_ngx_chips__["a" /* TagInputModule */],
                __WEBPACK_IMPORTED_MODULE_4__angular_forms__["g" /* ReactiveFormsModule */],
                __WEBPACK_IMPORTED_MODULE_5__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_6_ng2_pdf_viewer__["a" /* PdfViewerModule */],
                __WEBPACK_IMPORTED_MODULE_14_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_13__environments_environment__["a" /* environment */].firebase, 'angular-auth-firebase'),
                __WEBPACK_IMPORTED_MODULE_15_angularfire2_database__["a" /* AngularFireDatabaseModule */],
                __WEBPACK_IMPORTED_MODULE_17_angularfire2_firestore__["a" /* AngularFirestoreModule */],
                __WEBPACK_IMPORTED_MODULE_16_angularfire2_auth__["b" /* AngularFireAuthModule */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_9__employees_service__["a" /* EmployeesService */], __WEBPACK_IMPORTED_MODULE_11__book_service__["a" /* BookService */], __WEBPACK_IMPORTED_MODULE_18__auth_service__["a" /* AuthService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "../../../../../src/app/auth.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_auth__ = __webpack_require__("../../../../angularfire2/auth/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthService = /** @class */ (function () {
    function AuthService(firebaseAuth, http) {
        this.firebaseAuth = firebaseAuth;
        this.http = http;
        this.user = firebaseAuth.authState;
        this.restURL = __WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].restURL;
    }
    AuthService.prototype.signUpRegular = function (email, password) {
        return this.firebaseAuth
            .auth
            .createUserWithEmailAndPassword(email, password);
    };
    AuthService.prototype.signInRegular = function (email, password) {
        return this.firebaseAuth
            .auth
            .signInWithEmailAndPassword(email, password);
    };
    AuthService.prototype.testAdminGetUser = function () {
        return this.firebaseAuth.auth.currentUser;
    };
    AuthService.prototype.firstSignIn = function (newPassword) {
        return this.firebaseAuth.auth.currentUser.updatePassword(newPassword);
    };
    AuthService.prototype.updateUserNames = function (first_name, last_name, newPassword, phone_number) {
        var _this = this;
        var response = this.http.put(this.restURL + '/updateUserNamesByEmail', { 'email': this.firebaseAuth.auth.currentUser.email, 'first_name': first_name, 'last_name': last_name, 'phone_number': phone_number });
        return new Promise(function (resolve, reject) {
            response.subscribe(function (res) {
                _this.firebaseAuth.auth.currentUser.updatePassword(newPassword).then(function (res2) {
                    resolve(res);
                }, function (err2) {
                    var response = _this.http.put(_this.restURL + '/updateUserNamesByEmail', { 'email': _this.firebaseAuth.auth.currentUser.email, 'first_name': "", 'last_name': "", 'phone_number': null });
                    response.subscribe(function (res3) { console.log(res3); }, function (err3) { reject(err3); });
                    reject(err2);
                });
            }, function (err) {
                reject(err);
            });
        });
    };
    AuthService.prototype.getCurrentUser = function () {
        return this.firebaseAuth.auth.currentUser;
    };
    AuthService.prototype.resetPassword = function (userEmail) {
        //https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=AIzaSyDj3uGXUayslSgPJnwmpqHjwQ_c0ZCqBv4
        return this.http.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=AIzaSyDj3uGXUayslSgPJnwmpqHjwQ_c0ZCqBv4', { "requestType": "PASSWORD_RESET", "email": userEmail });
    };
    AuthService.prototype.logout = function () {
        this.firebaseAuth
            .auth
            .signOut();
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_auth__["a" /* AngularFireAuth */], __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "../../../../../src/app/book.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BookService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import {API_CONFIG, DEBUG_MODE} from './config/index';

var BookService = /** @class */ (function () {
    function BookService(http) {
        this.http = http;
        //this.setConfig();
        this.restURL = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].restURL;
        this._api = { 'endpoint': __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].restURL };
    }
    BookService.prototype.getBooks = function () {
        return this.http.get(this._api.endpoint + '/books');
    };
    BookService.prototype.saveBooks = function (data) {
        return this.http.post(this.restURL + '/new/book', data);
    };
    BookService.prototype.saveAssignment = function (lessionId, data) {
        return this.http.post(this.restURL + "/lessons/" + lessionId + "/assignment", data);
    };
    BookService.prototype.editAssignment = function (assignmentId, data) {
        return this.http.put(this.restURL + "/editAssignments", data);
    };
    BookService.prototype.getStatuses = function () {
        return this.http.get(this.restURL + "/getstatuses");
    };
    BookService.prototype.saveEmployee = function (group_id, data) {
        return this.http.post(this.restURL + "/groups/" + group_id + "/employees", data);
    };
    BookService.prototype.removeAssignmentFromGroup = function (data) {
        return this.http.post(this.restURL + "/lessons/remove-assignment", data);
    };
    BookService.prototype.saveGroup = function (data) {
        return this.http.post(this.restURL + "/groups/save", data);
    };
    BookService.prototype.addUser = function (data) {
        return this.http.post(this.restURL + "/addToGroupEmail", data);
    };
    BookService.prototype.batchSaveLesson = function (data) {
        return this.http.post(this.restURL + '/batch-save/lessons', data);
    };
    BookService.prototype.batchUpdateLesson = function (data) {
        return this.http.post(this.restURL + '/batch-update/lessons', data);
    };
    BookService.prototype.saveLessons = function (data) {
        return this.http.post(this.restURL + '/new/lesson', data);
    };
    BookService.prototype.getLessons = function () {
        return this.http.get(this.restURL + '/getlessons');
    };
    BookService.prototype.getBookLessons = function (bookId) {
        return this.http.get(this.restURL + "/books/" + bookId + "/lessons");
    };
    /*   setConfig(): void {
          if (DEBUG_MODE) {
               this._api = API_CONFIG.development;
          } else {
               this._api = API_CONFIG.production;
          }
      }
        */
    BookService.prototype.getConfig = function () {
        return this._api;
    };
    BookService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], BookService);
    return BookService;
}());



/***/ }),

/***/ "../../../../../src/app/employees.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import {API_CONFIG, DEBUG_MODE} from './config/index';

var EmployeesService = /** @class */ (function () {
    function EmployeesService(http) {
        this.http = http;
        this.restURL = __WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].restURL;
    }
    EmployeesService.prototype.convertToEmployeeArray = function () {
    };
    EmployeesService.prototype.getUserData = function (user_id) {
        var response = this.http.get(this.restURL + '/user/${user_id}');
        return response;
    };
    EmployeesService.prototype.email = function (user_emails, message) {
        var response = this.http.post(this.restURL + '/emailToList', { 'emailList': user_emails, 'text': message });
        return response;
    };
    EmployeesService.prototype.getMasterTable = function (admin_id) {
        var response = this.http.post(this.restURL + '/getMasterTable', { 'admin_id': admin_id });
        return response;
    };
    EmployeesService.prototype.getBooks = function () {
        var response = this.http.get(this.restURL + '/books');
        return response;
    };
    EmployeesService.prototype.getApk = function () {
        var response = this.http.get(this.restURL + '/apk', {
            responseType: 'blob',
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]().append('Content-Type', 'application/json')
        });
        return response;
    };
    EmployeesService.prototype.getLessons = function (group_id) {
        var response = this.http.post(this.restURL + '/getlessons', { 'group_id': group_id });
        return response;
    };
    EmployeesService.prototype.getEmployees = function (group_id, assignment_id) {
        var response = this.http.post(this.restURL + '/getemployeesstatus', { 'group_id': group_id, 'assignment_id': assignment_id });
        return response;
    };
    EmployeesService.prototype.getAssignments = function (group_id) {
        var response = this.http.post(this.restURL + '/getassignments2', { 'group_id': group_id });
        return response;
    };
    EmployeesService.prototype.getGroups = function (admin_id) {
        var response = this.http.post(this.restURL + '/getgroups', { 'admin_id': admin_id });
        return response;
    };
    EmployeesService.prototype.sendInvitationAdmin = function (data) {
        var response = this.http.post(this.restURL + '/inviteAdmin', data);
        return response;
    };
    EmployeesService.prototype.sendInvitationUser = function (data) {
        var response = this.http.post(this.restURL + '/inviteUser', data);
        return response;
    };
    EmployeesService.prototype.getAdminID = function (email) {
        var response = this.http.post(this.restURL + '/getAdminID', { 'email': email });
        return response;
    };
    EmployeesService.prototype.getUserByEmail = function (email) {
        var response = this.http.post(this.restURL + '/getUserByEmail', { 'email': email });
        return response;
    };
    EmployeesService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], EmployeesService);
    return EmployeesService;
}());



/***/ }),

/***/ "../../../../../src/app/employees/employees.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "#loginForm {\r\n  width: 75%;\r\n  margin-top: 2.5em;\r\n  margin-left: 12.5%;\r\n  font-size: 1.5em;\r\n}\r\n\r\n#userEmail,\r\n#userPassword {\r\n  margin-bottom: 2em;\r\n  padding: 0.5em;\r\n  font-size: 1em;\r\n}\r\n\r\n#loginButton {\r\n  font-size: 1em;\r\n  margin-bottom: 2em;\r\n  padding: 0.5em;\r\n}\r\n\r\n#errorMessage {\r\n  margin: 0em;\r\n  padding: 0em;\r\n}\r\n\r\n.user-info {\r\n  text-align: right;\r\n  font-size: 1.25em;\r\n}\r\n\r\ntable tbody {\r\ndisplay:block;\r\nheight:47em;\r\noverflow-y:auto;\r\n}\r\n\r\ntable thead, table tbody tr {\r\ndisplay:table;\r\nwidth:100%;\r\ntable-layout:fixed;\r\n}\r\n\r\n.user-logout {\r\n  cursor: pointer;\r\n  -webkit-transition: 0.2s ease-out all;\r\n  transition: 0.2s ease-out all;\r\n  color: #000000;\r\n}\r\n\r\n.user-logout:hover {\r\n  color: #FFFFFF;\r\n  -webkit-transition: 0.2s ease-out all;\r\n  transition: 0.2s ease-out all;\r\n}\r\n\r\n.assignment-list--container{\r\n    max-height: 100%;\r\n}\r\n\r\n.has-error input{\r\n    border-color: red;\r\n}\r\n\r\n.lessons tr.invalid {\r\n    border: 2px solid red !important;\r\n}\r\n\r\n* {\r\n  -webkit-box-sizing: border-box;\r\n          box-sizing: border-box;\r\n}\r\n\r\n.container {\r\n  max-width: 100%;\r\n}\r\n\r\n#groupTabs {\r\n  padding-top: 1em;\r\n  border-bottom: solid black 0.1em;\r\n}\r\n\r\n#groupTabs label {\r\n  border-top: solid black 0.1em;\r\n  border-bottom: solid black 0.1em;\r\n  border-left: solid black 0.1em;\r\n  border-right: solid black 0.1em;\r\n  -webkit-transform: translate(0%, 0.2em);\r\n          transform: translate(0%, 0.2em);\r\n  border-top-left-radius: 1em;\r\n  border-top-right-radius: 1em;\r\n}\r\n\r\n#groupTabs label:first-child {\r\n  border-left: solid black 0.1em;\r\n}\r\n\r\n#groupTabs button {\r\n  border-top: solid black 0.1em;\r\n  border-bottom: solid black 0.1em;\r\n  border-left: solid black 0.1em;\r\n  border-right: solid black 0.1em;\r\n  -webkit-transform: translate(0%, 0.2em);\r\n          transform: translate(0%, 0.2em);\r\n  border-top-left-radius: 1em;\r\n  border-top-right-radius: 1em;\r\n}\r\n\r\n#mainContainer {\r\n  border: solid black 0.1em;\r\n  border-top: solid black 0em;\r\n  background-color: #FFFFFF;\r\n}\r\n\r\n#summaryContainer {\r\n  margin: 0em;\r\n}\r\n\r\n#summaryContainer h5 {\r\n  margin: 1em;\r\n}\r\n\r\n.summary-button {\r\n  padding: 1em;\r\n  outline: none;\r\n  margin: 2em 1em;\r\n  min-width: 12em;\r\n}\r\n\r\n.summary-button-tab {\r\n  width: 100%;\r\n  padding: 1em;\r\n  background-color: #CCCCCC;\r\n  color: #000000;\r\n  border-radius: 0;\r\n  border: none;\r\n  margin-bottom: 2em;\r\n}\r\n\r\n#secondaryContainer {\r\n  height: 100%;\r\n}\r\n\r\n.date-header {\r\n  border-top: solid black 0.1em;\r\n  border-bottom: solid black 0.1em;\r\n  padding: 1em;\r\n}\r\n\r\n.book-header {\r\n  padding: 1em;\r\n}\r\n\r\n.lesson-header {\r\n  padding: 1em;\r\n  margin-top: 1em;\r\n  display: inline-block;\r\n}\r\n\r\n@media (min-width: 1200px) {\r\n  #secondaryContainer {\r\n    border-left: solid black 0.1em;\r\n    border-right: solid black 0.1em;\r\n  }\r\n\r\n  .date-header {\r\n    border-top: none;\r\n  }\r\n}\r\n\r\n#assignmentButton,\r\n#lessonButton,\r\n#assignmentButtonActive,\r\n#lessonButtonActive {\r\n  background: #CCCCCC;\r\n  outline: none;\r\n  font-size: 1.5em;\r\n  padding: 0.5em;\r\n  width: 100%;\r\n  font-weight: bold;\r\n  color: #FFFFFF;\r\n  text-align: center;\r\n  cursor: pointer;\r\n  margin: 0.5em 0em;\r\n}\r\n\r\n#assignmentButtonActive,\r\n#lessonButtonActive {\r\n  background-color: #999999;\r\n}\r\n\r\n#lessonsContainer {\r\n  padding: 1em;\r\n}\r\n\r\n.date-header h4 {\r\n  margin: 0;\r\n  padding: 0;\r\n}\r\n\r\n.assignment-summary {\r\n  padding: 1em 1em 0em 1em;\r\n  border-bottom: solid black 0.1em;\r\n  cursor: pointer;\r\n  overflow: hidden;\r\n}\r\n\r\n.assignment-summary-selected,\r\n.assignment-summary:hover {\r\n  background-color: #EEEEEE;\r\n}\r\n\r\n.assignment-date-range,\r\n.assignment-date-range-date {\r\n  display: inline-block;\r\n}\r\n\r\n.assignment-date-range-date {\r\n  float: right;\r\n}\r\n\r\n.empty-assignments {\r\n  padding: 1em;\r\n  border-bottom: solid black 0.1em;\r\n}\r\n\r\n.col-xl-2 {\r\n  padding: 0;\r\n}\r\n\r\n#thirdColumn {\r\n  margin: 0;\r\n  padding: 1em;\r\n}\r\n\r\n.employee-row {\r\n  position: relative;\r\n}\r\n\r\n.employee-row:hover .employee-delete p {\r\n  opacity: 1;\r\n}\r\n\r\n.employee-delete p {\r\n  vertical-align: middle;\r\n  text-align: center;\r\n  padding: 0em;\r\n  margin: 0em;\r\n  opacity: 0;\r\n}\r\n\r\n.employee-delete {\r\n  cursor: pointer;\r\n}\r\n\r\n#groupSummary h4 {\r\n  padding: 0;\r\n  margin: 0;\r\n  margin-bottom: 1em;\r\n}\r\n\r\n#groupActions .row {\r\n  padding: 0em 1em;\r\n}\r\n\r\n#groupActions .icon-text,\r\n#groupActions .icon-action {\r\n  width: calc(100% / 3);\r\n}\r\n\r\n.icon-text .icon,\r\n.icon-action .icon {\r\n  height: 1.5em;\r\n  width: 1.5em;\r\n  display: inline-block;\r\n}\r\n\r\n.icon-text img,\r\n.icon-action img {\r\n  height: 1.5em;\r\n  width: 1.5em;\r\n}\r\n\r\n.icon-text .text,\r\n.icon-action .text {\r\n  display: inline-block;\r\n}\r\n\r\n@media (max-width: 500px) {\r\n  .icon-text .icon,\r\n  .icon-action .icon {\r\n    display: none;\r\n  }\r\n}\r\n\r\n.icon-action:hover {\r\n  cursor: pointer;\r\n  color: #29ABE0;\r\n}\r\n\r\n#bookDropdown {\r\n  margin: 0em 0.75em;\r\n  width: 70%;\r\n  display:inline-block;\r\n  font-size: 1.5em;\r\n}\r\n\r\n#addBookButton {\r\n  float:right;\r\n  width: 20%;\r\n  margin-top: -0.25em;\r\n}\r\n\r\n.input-range {\r\n  width: 5em;\r\n}\r\n\r\n#addLessonButton {\r\n  width: 10em;\r\n}\r\n\r\n#thirdColumn,\r\n#secondColumn {\r\n  padding: 0em;\r\n}\r\n\r\n#thirdColumn #groupSummary,\r\n#thirdColumn .table-container {\r\n  padding: 1em;\r\n}\r\n\r\n.pdf-controller {\r\n  padding: 1em;\r\n}\r\n\r\n.pdf-controller button {\r\n  width: 5em;\r\n}\r\n\r\n.pdf-controller input {\r\n  width: calc(100% - 11em);\r\n}\r\n\r\n@media (max-width: 1200px) {\r\n  #lessonsContainer {\r\n    border-top: solid black 0.1em;\r\n    border-bottom: solid black 0.1em;\r\n  }\r\n}\r\n\r\n.date-labels,\r\n.date-inputs {\r\n  font-size: 0;\r\n}\r\n\r\n.date-inputs input,\r\n.date-labels p {\r\n  font-size: 16px;\r\n  width: 45%;\r\n  margin: 0em;\r\n  padding: 0em;\r\n  display: inline-block;\r\n}\r\n\r\n.date-inputs input:first-of-type,\r\n.date-labels p:first-of-type {\r\n  margin-right: 5%;\r\n}\r\n\r\n#notesInput {\r\n  width: 100%;\r\n}\r\n\r\n.reading-time-input input,\r\n.reading-time-input p {\r\n  display: inline-block;\r\n}\r\n\r\n#mainContainer {\r\n  position: relative;\r\n}\r\n\r\n.pdf-controller {\r\n  height: 5em;\r\n}\r\n\r\n#thirdColumn {\r\n  position: relative;\r\n}\r\n\r\npdf-viewer {\r\n  width:100%;\r\n  height: 100%;\r\n  overflow: auto;\r\n  position: absolute;\r\n}\r\n\r\n@media (min-width: 1000px) {\r\n  .col-xl-2 {\r\n    -webkit-box-flex: 0;\r\n    -ms-flex: 0 0 16.6666666667%;\r\n    flex: 0 0 16.6666666667%;\r\n    max-width: 16.6666666667%;\r\n  }\r\n\r\n  .col-xl-4 {\r\n    -webkit-box-flex: 0;\r\n    -ms-flex: 0 0 33.3333333333%;\r\n    flex: 0 0 33.3333333333%;\r\n    max-width: 33.3333333333%;\r\n  }\r\n\r\n  .col-xl-6 {\r\n    -webkit-box-flex: 0;\r\n    -ms-flex: 0 0 50%;\r\n    flex: 0 0 50%;\r\n    max-width: 50%;\r\n  }\r\n\r\n  .col-xl-8 {\r\n    -webkit-box-flex: 0;\r\n    -ms-flex: 0 0 66.6666666667%;\r\n    flex: 0 0 66.6666666667%;\r\n    max-width: 66.6666666667%;\r\n  }\r\n\r\n  .col-xl-10 {\r\n    -webkit-box-flex: 0;\r\n    -ms-flex: 0 0 83.3333333333%;\r\n    flex: 0 0 83.3333333333%;\r\n    max-width: 83.3333333333%;\r\n  }\r\n}\r\n\r\n@media (min-width: 1000px) {\r\n  #secondaryContainer {\r\n    border-left: solid black 0.1em;\r\n    border-right: solid black 0.1em;\r\n  }\r\n}\r\n\r\n@media (min-width: 1000px) {\r\n  .date-header {\r\n    border-top: none;\r\n  }\r\n}\r\n\r\n.login-form {\r\n  padding: 1em;\r\n  font-size: 1.5em;\r\n}\r\n\r\n.login-button {\r\n  padding: 0.5em;\r\n  font-size: 1.5em;\r\n}\r\n\r\n.alert-danger {\r\n  margin: 0em 1em;\r\n  font-size: 1.5em;\r\n  padding: 0.5em;\r\n}\r\n\r\n.alert-danger p {\r\n  margin: 0;\r\n}\r\n\r\n.due-title, .due-value {\r\n  display: inline-block;\r\n  margin: 0;\r\n  padding: 0.5em;\r\n}\r\n\r\n.due-title {\r\n  float: left;\r\n}\r\n\r\n.due-value {\r\n  float: right;\r\n}\r\n\r\n.due-holder {\r\n  font-size: 1.2em;\r\n  width: 100%;\r\n  display: block;\r\n  height: 2.5em;\r\n}\r\n\r\n#deleteLessonButton {\r\n  display: none;\r\n}\r\n\r\n#deleteLessonButton.show {\r\n  display: inline-block;\r\n}\r\n\r\n.notes {\r\n  position: relative;\r\n}\r\n\r\n.notes img {\r\n  height: 1.5em;\r\n  margin: 0.5em 0em;\r\n}\r\n\r\n.notes-hover {\r\n  display: none;\r\n  position: absolute;\r\n    border: solid 0.1em #CCCCCC;\r\n    background: #FFFFFF;\r\n    border-radius: 2em;\r\n    padding: 0.5em;\r\n}\r\n\r\n.notes:hover .notes-hover {\r\n  display:block;\r\n}\r\n\r\n#groupTabs label {\r\n  min-width: 10em;\r\n}\r\n\r\n#notesDisplay {\r\n  width: 100%;\r\n  word-wrap: break-word;\r\n  margin: 0.5em 0em;\r\n  font-size: 1.2em;\r\n}\r\n\r\n#adminMenu {\r\n  display: none;\r\n  z-index: 1;\r\n  position: absolute;\r\n    right: 0;\r\n    margin: 1em;\r\n    top: 2em;\r\n    background: #FFFFFF;\r\n    width: 9em;\r\n    border: solid black 0.1em;\r\n    border-bottom-width: 0em;\r\n}\r\n\r\n#adminMenu div {\r\n  border-bottom: solid black 0.1em;\r\n  padding: 0.5em;\r\n  cursor: pointer;\r\n}\r\n\r\n.logo {\r\n  width: 30em;\r\n  margin: auto;\r\n  display: block;\r\n}\r\n\r\na {\r\n  color: #59CBE8\r\n}\r\n\r\n.support {\r\n  color: #000000;\r\n  text-decoration: none;\r\n}\r\n\r\n.status-complete {\r\n  background: #e1efcd;\r\n}\r\n\r\n.status-warning {\r\n  background: #f4c480;\r\n}\r\n\r\n.status-incomplete {\r\n  background: #FFCCCB;\r\n}\r\n\r\n.status {\r\n  margin-left: -1em;\r\n  margin-right: -1em;\r\n  width: calc(100% + 2em);\r\n  padding-left: 1em;\r\n  padding-right: 1em;\r\n}\r\n\r\n.lesson-name-input {\r\n  min-width: 100% !important;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/employees/employees.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" *ngIf=\"isLoggedIn==false && !newUser\">\r\n  <img class=\"logo\" src=\"assets/pngs/Liberty Logo.png\" />\r\n  <form class=\"login-form\" name=\"userform\" method=\"post\" #formCtrl=\"ngForm\">\r\n\r\n    <label for=\"exampleInputEmail1\">Email address</label>\r\n    <input type=\"email\" class=\"form-control\" id=\"userEmail\" [(ngModel)]=\"userEmail\" required [ngModelOptions]=\"{standalone: true}\">\r\n\r\n    <label for=\"exampleInputPassword1\">Password</label>\r\n    <input type=\"password\" class=\"form-control\" id=\"userPassword\" [(ngModel)]=\"userPassword\" required [ngModelOptions]=\"{standalone: true}\">\r\n\r\n    <div class=\"form-group\">\r\n      <button type=\"buton\" class=\"login-button btn btn-primary btn-block\" style=\"margin-bottom: 20px\" (click)=\"signInWithEmail()\">\r\n        Login with Email\r\n      </button>\r\n\r\n    </div>\r\n  </form>\r\n  <div *ngIf=\"isLoginError==true\" class=\"alert alert-danger\">\r\n    <p>{{loginErrorMessage}}</p>\r\n  </div>\r\n  <div>\r\n    <!--<button (click)=\"testGetEmployee()\">Test Get Employee by Email</button>-->\r\n\t<button id=\"resetButton\" style=\"margin: 20px; padding: 5px; width: 400px; height: 50px; text-align: center; font-size: 24px; box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);\" class=\"btn btn-primary\" (click)=\"resetPassword()\" data-toggle=\"modal\" data-target=\"#resetPasswordModal\">Reset Password</button>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"container\" *ngIf=\"newUser\">\r\n  <form class=\"login-form\" name=\"newUserForm\" method=\"post\">\r\n    <label>First Name</label>\r\n    <input type=\"text\" class=\"form-control\" id=\"newUserFirstName\" [(ngModel)]=\"newUserFirstName\" required [ngModelOptions]=\"{standalone: true}\">\r\n    <label>Last Name</label>\r\n    <input type=\"text\" class=\"form-control\" id=\"newUserLastName\" [(ngModel)]=\"newUserLastName\" required [ngModelOptions]=\"{standalone: true}\">\r\n    <label>Phone Number</label>\r\n    <input type=\"tel\" class=\"form-control\" id=\"newUserPhoneNumber\" [(ngModel)]=\"newUserPhoneNumber\" required [ngModelOptions]=\"{standalone: true}\">\r\n    <label>New Password</label>\r\n    <input type=\"password\" class=\"form-control\" id=\"newPassword\" [(ngModel)]=\"newPassword\" required [ngModelOptions]=\"{standalone: true}\">\r\n    <label>Confirm Password</label>\r\n    <input type=\"password\" class=\"form-control\" id=\"confirmPassword\" [(ngModel)]=\"confirmPassword\" required [ngModelOptions]=\"{standalone: true}\">\r\n    <div class=\"form-group\">\r\n      <button type=\"buton\" class=\"login-button btn btn-primary btn-block\" style=\"margin-bottom: 20px\" (click)=\"signInFirstTime()\">\r\n        Update User Info\r\n      </button>\r\n    </div>\r\n  </form>\r\n  <div *ngIf=\"isLoginError==true\" class=\"alert alert-danger\">\r\n    <p>{{loginErrorMessage}}</p>\r\n  </div>\r\n</div>\r\n\r\n\r\n<div class=\"container\" *ngIf=\"isLoggedIn && admin_id > 0 && !newUser\">\r\n  <!--\r\n\t<div class=\"row\">\r\n\t<button (click)=\"testGetEmployee()\">Test Get Employee by Email</button>\r\n\t</div>\r\n\t-->\r\n  <div class=\"name-container\" style=\"width: 100%; height: 6em; margin-top:1em\">\r\n\t\t<img style=\"height: 6em; margin-top: -1em; padding: 2px;\" src=\"assets/pngs/Liberty Logo.png\" />\r\n    <img style=\"float: right; height: 1.5em; margin: 0em 0em 0em 1em; cursor: pointer\" (click)=\"toggleMenu()\" src=\"assets/pngs/cog.png\"\r\n    />\r\n    <p style=\"margin: 0; float: right; font-size: 1.2em;\">{{firstName}} {{lastName}}</p>\r\n    <div id=\"adminMenu\">\r\n      <div (click)=\"inviteAdminAction()\" data-toggle=\"modal\" data-target=\"#inviteAdminModal\">Add Admin</div>\r\n      <div (click)=\"logout()\">Log Out</div>\r\n      <div>\r\n        <a class=\"support\" href=\"mailto:libertyelevatorreader@gmail.com\">Contact Support</a>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"row\" id=\"groupTabs\">\r\n    <div class=\"btn-group btn-group-toggle\" data-toggle=\"buttons\">\r\n      <label class=\"btn btn-primary\" *ngFor=\"let group of groups\" (click)=\"groupSelect(group)\">\r\n        <input type=\"radio\" name=\"groups\" id={{group.ID}} autocomplete=\"off\" value={{group.ID}}>{{group.NAME}}\r\n      </label>\r\n      <button type=\"button\" class=\"btn btn-info\" (click)=\"addGroup()\" data-toggle=\"modal\" data-target=\"#addGroupModal\">Add Group</button>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"row\" id=\"mainContainer\">\r\n    <div class=\"col-xl-2\">\r\n      <div id=\"summaryContainer\">\r\n        <h5 *ngIf=\"selectedGroup !== undefined ? selectedGroup !== null : false\">{{selectedGroup.NAME}}</h5>\r\n        <h5 *ngIf=\"selectedGroup !== undefined && employees.length == 1 ? selectedGroup !== null : false\">{{employees.length}} Employee</h5>\r\n        <h5 *ngIf=\"selectedGroup !== undefined && employees.length > 1 ? selectedGroup !== null : false\">{{employees.length}} Employees</h5>\r\n        <button *ngIf=\"selectedGroup && selectedGroup !== undefined\" type=\"button\" class=\"btn btn-info summary-button\" data-toggle=\"modal\"\r\n          data-target=\"#addEmployeeModal\">+ Add Employee</button>\r\n        <div *ngIf=\"selectedGroup !== undefined ? selectedGroup !== null : false\" (click)=\"viewSwitch('assignments')\" id=\"assignmentButton\">Assignments</div>\r\n        <div *ngIf=\"selectedGroup !== undefined ? selectedGroup !== null : false\" (click)=\"viewSwitch('lessons')\" id=\"lessonButton\">Lesson Plan</div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"col-xl-0\" id=\"secondColumn\">\r\n      <div *ngIf=\"viewAssignments || viewLessons\" id=\"secondaryContainer\">\r\n        <div *ngIf=\"viewAssignments\" id=\"assignmentsContainer\">\r\n\t<div id=\"assignmentHeader\">\r\n          <div class=\"date-header\" style=\"height: 7em\">\r\n            <h4 style=\"float: left; margin-top: 1em;\">Due Date</h4>\r\n            <div class=\"due-sort\" style=\"float: right\" (click)=\"toggleSort()\">\r\n              <div class=\"due-asc\" *ngIf=\"sortAscending\">\r\n                <img src=\"assets/pngs/arrow-up3.png\" />\r\n              </div>\r\n              <div class=\"due-desc\" *ngIf=\"sortDescending\">\r\n                <img src=\"assets/pngs/arrow-down3.png\" />\r\n              </div>\r\n            </div>\r\n          </div>\r\n          <div *ngIf=\"assignments[0].NAME == 'No assignments'\" class=\"empty-assignments\">No Assignments</div>\r\n\t</div>\r\n\t<div id=\"assignmentList\" style=\"overflow-y: auto; height: 60em;\">\r\n          <div *ngIf=\"assignments[0].NAME !== 'No assignments'\" class=\"assignment-list--container\">\r\n            <div *ngFor=\"let assignment of assignments; let i = index\" class=\"assignment-summary\" (click)=\"assignmentSelect(assignment, i)\">\r\n              <h5>{{assignment.NAME}}</h5>\r\n              <!--\r\n\t\t\t\t\t\t\t<button class=\"btn btn-sm btn-success\" (click)=\"removeAssignment(assignment)\" style=\"width: 100%\">\r\n\t\t\t\t\t\t\t\t<i class=\"fa fa-check\"></i> Remove Assignment\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t\t-->\r\n              <div class=\"due-holder\">\r\n                <p class=\"due-title\">Due: </p>\r\n                <p class=\"due-value\">{{assignment.DUE_DATE | date:'MM/dd/yyyy'}}</p>\r\n              </div>\r\n              <div class=\"due-holder\">\r\n                <p class=\"due-title\">Available: </p>\r\n                <p class=\"due-value\">{{assignment.START_DATE | date:'MM/dd/yyyy'}}</p>\r\n              </div>\r\n\r\n\r\n              <div *ngIf=\"assignment.percent_complete == 1 && (assignment.START_DATE | date:'MM/dd/yyyy') <= (currentDate | date:'MM/dd/yyyy')\" class=\"due-holder status-complete status\">\r\n                <p class=\"due-title\">Percent Complete: </p>\r\n                <p class=\"due-value\">{{assignment.percent_complete | percent}}</p>\r\n              </div>\r\n\t\t\t\t\t\t\t<div *ngIf=\"assignment.percent_complete !== 1 && (assignment.DUE_DATE | date:'MM/dd/yyyy') >= (warningDate | date:'MM/dd/yyyy') && (assignment.DUE_DATE | date:'MM/dd/yyyy') > (currentDate | date:'MM/dd/yyyy') && (assignment.START_DATE | date:'MM/dd/yyyy') <= (currentDate | date:'MM/dd/yyyy')\" class=\"due-holder status-warning status\">\r\n\t\t\t\t\t\t\t\t<p class=\"due-title\">Percent Complete: </p>\r\n                <p class=\"due-value\">{{assignment.percent_complete | percent}}</p>\r\n              </div>\r\n\t\t\t\t\t\t\t<div *ngIf=\"assignment.percent_complete !== 1 && (assignment.DUE_DATE | date:'MM/dd/yyyy') < (currentDate | date:'MM/dd/yyyy')\" class=\"due-holder status-incomplete status\">\r\n\t\t\t\t\t\t\t\t<p class=\"due-title\">Percent Complete: </p>\r\n                <p class=\"due-value\">{{assignment.percent_complete | percent}}</p>\r\n              </div>\r\n\r\n\t\t\t\t\t\t\t<div *ngIf=\"assignment.percent_complete !== 1 && ((assignment.START_DATE | date:'MM/dd/yyyy') <= (currentDate | date:'MM/dd/yyyy') && (assignment.DUE_DATE | date:'MM/dd/yyyy') >= (currentDate | date:'MM/dd/yyyy') && (assignment.DUE_DATE | date:'MM/dd/yyyy') < (warningDate | date:'MM/dd/yyyy'))\" class=\"due-holder\">\r\n                <p class=\"due-title\">Percent Complete: </p>\r\n                <p class=\"due-value\">{{assignment.percent_complete | percent}}</p>\r\n              </div>\r\n\r\n            </div>\r\n          </div>\r\n\t</div>\r\n        </div>\r\n\r\n\r\n        <div *ngIf=\"viewLessons\" id=\"lessonsContainer\">\r\n          <div class=\"book-header\">\r\n            <h4>Book</h4>\r\n          </div>\r\n          <div>\r\n            <select name=\"book\" id=\"bookDropdown\" [(ngModel)]=\"selectedBook\" (change)=\"onChangeBook($event)\" class=\"form-control input-sm\">\r\n              <option *ngFor=\"let book of dataObj.books;\" [value]=\"book.ID\">{{book.NAME}}</option>\r\n            </select>\r\n            <button type=\"button\" (click)=\"resetForm()\" data-toggle=\"modal\" data-target=\"#newBookModal\" class=\"btn btn-info\">+Add Book</button>\r\n          </div>\r\n\r\n          <div class=\"col-md-12\" *ngIf=\"dataObj.selectedBook\">\r\n            <h3>{{dataObj.selectedBook.NAME}}</h3>\r\n            <span>Total Pages :\r\n              <strong>{{dataObj.selectedBook.TOTAL_PAGES}}</strong>\r\n            </span>\r\n          </div>\r\n\r\n\r\n          <div class=\"lesson-header\">\r\n            <h4>Lessons</h4>\r\n          </div>\r\n          <div *ngIf=\"dataObj.selectedBook && dataObj.selectedBook.TOTAL_PAGES > 0\">\r\n            <div class=\"scrollbar\">\r\n              <table class=\"table table-hover lessons\">\r\n                <thead>\r\n                  <tr>\r\n                    <th style=\"width: 3em\"></th>\r\n                    <th>Name</th>\r\n                    <th style=\"width: 7em\">Start Page</th>\r\n                    <th style=\"width: 7em\">End Page</th>\r\n                    <th style=\"width: 10em\"></th>\r\n                  </tr>\r\n                </thead>\r\n                <tbody>\r\n                  <tr *ngFor=\"let lesson of dataObj.selectedBook.LESSONS;\" [ngClass]=\"{invalid:!lesson.validationCheck(dataObj.selectedBook.TOTAL_PAGES)}\">\r\n                    <td style=\"width: 3em\">\r\n                      <input type=\"checkbox\" name=\"lession[][id]\" (click)=\"toggle(lesson)\">\r\n                    </td>\r\n                    <td>\r\n                      <input type=\"text\" class=\"lesson-name-input form-control input-lg col-lg-8\" (change)=\"lesson.changed()\" name=\"lession[][name]\" [(ngModel)]=\"lesson.NAME\">\r\n                    </td>\r\n                    <td style=\"width: 7em\">\r\n                      <input type=\"number\" class=\"form-control input-sm\" (change)=\"lesson.changed();\" (click)=\"changePdfPageNo(lesson.START_PAGE)\"\r\n                        (keyup)=\"changePdfPageNo(lesson.START_PAGE)\" [max]=\"dataObj.selectedBook.TOTAL_PAGES\" name=\"lession[][start_page]\"\r\n                        [(ngModel)]=\"lesson.START_PAGE\" min=\"0\">\r\n                    </td>\r\n                    <td style=\"width: 7em\">\r\n                      <input class=\"form-control input-sm \" type=\"number\" (change)=\"lesson.changed();\" (click)=\"changePdfPageNo(lesson.END_PAGE)\"\r\n                        (keyup)=\"changePdfPageNo(lesson.END_PAGE)\" [max]=\"dataObj.selectedBook.TOTAL_PAGES\" name=\"lession[][end_page]\"\r\n                        [(ngModel)]=\"lesson.END_PAGE\" min=\"0\">\r\n                    </td>\r\n                    <td style=\"width: 10em\">\r\n                      <button style=\"width: 10em\" class=\"btn btn-sm btn-success\" *ngIf=\"lesson.isAssignedByGroupId(selectedGroup.ID)\">\r\n\r\n                        <i class=\"fa fa-check\"></i> Assigned\r\n\r\n                      </button>\r\n\r\n                      <!--\r\n                                                           <button class=\"btn btn-sm btn-success\"\r\n                                                                   *ngIf=\"lesson.isAssignedByGroupId(selectedGroup.ID)\"\r\n                                                           (click)=\"removeAssignment(lesson)\">\r\n\r\n                                                               <i class=\"fa fa-check\"></i> Remove Assignment\r\n\r\n                                                           </button>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t -->\r\n\r\n                      <button style=\"width: 10em\" class=\"btn btn-sm btn-info\" data-toggle=\"modal\" (click)=\"selectLesson(lesson)\" data-target=\"#newAssignment\"\r\n                        *ngIf=\"!lesson.isAssignedByGroupId(selectedGroup.ID) && lesson.ID\">\r\n                        Add Assignment\r\n                      </button>\r\n                    </td>\r\n                  </tr>\r\n\r\n                </tbody>\r\n              </table>\r\n            </div>\r\n          </div>\r\n\r\n          <button (click)=\"addLesson()\" class=\"btn btn-primary \">+ Add Lesson</button>\r\n          <button (click)=\"saveLessons()\" class=\"btn btn-primary \">Save</button>\r\n          <button id=\"deleteLessonButton\" (click)=\"deleteLessons()\" class=\"btn btn-primary\">Remove Lessons</button>\r\n          <!--<button type=\"button\" class=\"btn btn-info\" id=\"addLessonButton\" data-toggle=\"modal\" data-target=\"#newLessonModal\">+ Add</button>-->\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"col-xl-10\" id=\"thirdColumn\">\r\n      <div *ngIf=\"viewAssignments || !viewLessons\">\r\n        <div id=\"groupSummary\">\r\n\t\t<h4 *ngIf=\"selectedAssignment === undefined\">No Assignment Selected</h4>\r\n\t\t<div *ngIf=\"selectedAssignment !== undefined\">\r\n          <h4 *ngIf=\"selectedAssignment.assignment_id === -1 ? selectedAssignment.NAME !== 'No assignments' : false\">No Assignment Selected</h4>\r\n          <h4 *ngIf=\"selectedAssignment.assignment_id > -1 ? selectedAssignment.NAME !== 'No assignments' : false\">{{selectedAssignment.NAME}}</h4>\r\n\t\t </div>\r\n          <div id=\"groupActions\">\r\n            <div class=\"row\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">\r\n              <div data-toggle=\"modal\" data-target=\"#editAssignmentModal\" (click)=\"editAssignment(selectedAssignment)\">\r\n                <img style=\"height: 1.5em;\" src=\"assets/pngs/ic_edit_48px.png\" style=\"margin: 0em 1em 1em 0em; height: 1.5em\" />\r\n              </div>\r\n              <div (click)=\"removeAssignment(selectedAssignment)\">\r\n                <img style=\"height: 1.5em;\" src=\"assets/pngs/trash.png\" style=\"margin: 0em 0em 1em 1em; height: 1.5em\" />\r\n              </div>\r\n            </div>\r\n            <div class=\"row\" style=\"margin-bottom: 1em\">\r\n              <div class=\"icon-text\">\r\n                <div class=\"icon\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">\r\n                  <img src=\"assets/pngs/hourglass.png\" />\r\n                </div>\r\n                <div class=\"text\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">{{countdown | date: \"m 'minutes' ss 'seconds'\"}}</div>\r\n              </div>\r\n              <div class=\"icon-action\" data-toggle=\"modal\" data-target=\"#pdfPreviewModal\">\r\n                <div class=\"icon\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">\r\n                  <img src=\"assets/pngs/ic_picture_as_pdf_48px.png\" />\r\n                </div>\r\n                <div class=\"text\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">PDF</div>\r\n              </div>\r\n              <div class=\"icon-action\" (click)=\"emailGroup()\" data-toggle=\"modal\" data-target=\"#emailModal\">\r\n                <div class=\"icon\">\r\n                  <img src=\"assets/pngs/mail.png\" />\r\n                </div>\r\n                <div class=\"text\">Email all employees</div>\r\n              </div>\r\n            </div>\r\n            <div class=\"row\">\r\n              <div class=\"icon-text\">\r\n                <div class=\"icon\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">\r\n                  <img src=\"assets/pngs/calendar.png\" />\r\n                </div>\r\n                <div class=\"text\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">{{selectedAssignment.DUE_DATE| date : \"MM/dd/yyyy\"}}</div>\r\n              </div>\r\n              <div class=\"icon-text\">\r\n                <div class=\"icon\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">\r\n                  <img src=\"assets/pngs/cs-cc-party.png\" />\r\n                </div>\r\n                <div class=\"text\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">{{selectedAssignmentCompletion}} of employees finished</div>\r\n              </div>\r\n              <div class=\"icon-action\" (click)=\"emailGroupIncomplete()\" data-toggle=\"modal\" data-target=\"#emailModal\">\r\n                <div class=\"icon\">\r\n                  <img src=\"assets/pngs/mail.png\" />\r\n                </div>\r\n                <div class=\"text\">Email all incomplete</div>\r\n              </div>\r\n            </div>\r\n            <div class=\"row\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' && selectedAssignment.NOTES !== undefined: false\">\r\n              <p id=\"notesDisplay\">{{selectedAssignment.NOTES}}</p>\r\n            </div>\r\n            <!--\r\n\t\t\t\t\t\t<div class=\"row\" *ngIf=\"selectedAssignment !== undefined ? selectedAssignment.NAME !== 'No assignments' : false\">\r\n\t\t\t\t\t\t\t<button class=\"btn btn-sm btn-success\" (click)=\"removeAssignment(selectedAssignment)\" style=\"margin: 0.5em 0.5em 0.5em 0em\">\r\n\t\t\t\t\t\t\t\t<i class=\"fa fa-check\"></i> Remove Assignment\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t\t<button class=\"btn btn-sm btn-success\" data-toggle=\"modal\" data-target=\"#editAssignmentModal\" (click)=\"editAssignment(selectedAssignment)\" style=\"margin: 0.5em 0.5em 0.5em 0em\">\r\n\t\t\t\t\t\t\t\t<i class=\"fa fa-check\"></i> Edit Assignment\r\n\t\t\t\t\t\t\t</button>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t-->\r\n          </div>\r\n        </div>\r\n        <div class=\"table-container\">\r\n          <table class=\"table table-hover\" style=\"width: 100%;\">\r\n            <thead>\r\n              <th style=\"width: 10%;\"></th>\r\n              <th scope=\"col\" style= \"width: 25%;\">First Name</th>\r\n              <th scope=\"col\" style=\"width: 25%;\">Last Name</th>\r\n              <th scope=\"col\" style=\"width: 27%;\">Email</th>\r\n              <th scope=\"col\" style=\"width: 13%;\">Completed</th>\r\n            </thead>\r\n            <tr style=\"width: 100%;\" class=\"employee-row\" *ngFor=\"let employee of employees\" [class.table-success]=\"employee.IS_COMPLETE !== null ? employee.IS_COMPLETE.data[0] === 1 : false\">\r\n              <td style=\"width: 10%;\" class=\"employee-delete\">\r\n                <p>X</p>\r\n              </td>\r\n              <td style= \"width: 25%;\">{{employee.FIRST_NAME | pending}}</td>\r\n              <td style= \"width: 25%;\">{{employee.LAST_NAME | pending}}</td>\r\n              <td style= \"width: 30%;\">\r\n                <a style=\"color: black; text-decoration: underline;\" href=\"mailto:{{employee.EMAIL}}\">{{employee.EMAIL}}</a>\r\n              </td>\r\n              <td style= \"width: 10%;\" *ngIf=\"selectedAssignment !== null && employee.IS_COMPLETE != null ? employee.IS_COMPLETE.data[0] === 1 : false\">\r\n                <input type=\"checkbox\" disabled checked/>\r\n              </td>\r\n              <td style= \"width: 10%;\" *ngIf=\"employee.IS_COMPLETE != null ? employee.IS_COMPLETE.data[0] === 0 : true\">\r\n                <input type=\"checkbox\" disabled/>\r\n              </td>\r\n            </tr>\r\n          </table>\r\n        </div>\r\n      </div>\r\n\r\n      <div *ngIf=\"viewLessons && testPdf && dataObj.selectedBook\">\r\n        <div class=\"pdf-controller\">\r\n          <button class=\"btn btn-primary\" [disabled]=\"'1' == pdfCurrentPage\" (click)=\"decrementPage()\">Prev</button>\r\n          <input type=\"number\" [(ngModel)]=\"pdfCurrentPage\">\r\n          <button class=\"btn btn-primary\" [disabled]=\"dataObj.selectedBook.TOTAL_PAGES == pdfCurrentPage\" (click)=\"incrementPage()\">Next\r\n          </button>\r\n        </div>\r\n        <pdf-viewer style=\"min-height: 47em;\" [src]=\"testPdf\" [render-text]=\"false\" [(page)]=\"pdfCurrentPage\" (error)=\"onPdfLoadError($event)\"\r\n          (after-load-complete)=\"generateLessonPlan($event)\" [show-all]=\"false\" [original-size]=\"false\" style=\"display: block;\"></pdf-viewer>\r\n      </div>\r\n    </div>\r\n\r\n    <div style=\"min-height: 47em\" class=\"col-xl-0\" id=\"fourthColumn\" style=\"display: none\">\r\n      <div class=\"pdf-controller\">\r\n        <button class=\"btn btn-primary\" [disabled]=\"'1' == pdfCurrentPagePreview\" (click)=\"decrementPagePreview()\">Prev</button>\r\n        <input type=\"number\" [(ngModel)]=\"pdfCurrentPagePreview\">\r\n        <button class=\"btn btn-primary\" [disabled]=\"pdfCurrentPagePreviewMax == pdfCurrentPage\" (click)=\"incrementPagePreview()\">Next\r\n        </button>\r\n      </div>\r\n\r\n      <pdf-viewer style=\"min-height: 47em;\" [src]=\"previewPdf\" [(page)]=\"pdfCurrentPagePreview\" [show-all]=\"false\" [render-text]=\"false\"></pdf-viewer>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <div class=\"modal fade\" id=\"newAssignmentModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">Create Assignment</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <p *ngIf=\"dataObj.selectedLesson && dataObj.selectedLesson !== undefined\">{{dataObj.selectedLesson.NAME}}</p>\r\n          <form>\r\n            <fieldset>\r\n              <div class=\"date-labels\">\r\n                <p>Available From: </p>\r\n                <p>Due: </p>\r\n              </div>\r\n              <div class=\"date-inputs\">\r\n                <input type=\"date\" id=\"startDate\">\r\n                <input type=\"date\" id=\"dueDate\">\r\n              </div>\r\n              <br>\r\n              <p>Minimum reading time: </p>\r\n              <div class=\"reading-time-input\">\r\n                <input type=\"number\" />\r\n                <p>minutes</p>\r\n                <input type=\"seconds\" />\r\n                <p>seconds</p>\r\n              </div>\r\n              <br>\r\n              <p>Notes</p>\r\n              <textarea id=\"notesInput\" rows=\"5\"></textarea>\r\n            </fieldset>\r\n          </form>\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n          <button type=\"button\" class=\"btn btn-primary\">Start Assignment</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"modal fade\" id=\"pdfPreviewModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">PDF Preview</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n\r\n        <div class=\"modal-body\" style=\"height: 50em; padding: 0;\">\r\n          <div class=\"pdf-controller\">\r\n            <button class=\"btn btn-primary\" [disabled]=\"'1' == pdfCurrentPagePreview\" (click)=\"decrementPagePreview()\">Prev</button>\r\n            <input type=\"number\" [(ngModel)]=\"pdfCurrentPagePreview\">\r\n            <button class=\"btn btn-primary\" [disabled]=\"pdfCurrentPagePreviewMax == pdfCurrentPage\" (click)=\"incrementPagePreview()\">Next\r\n            </button>\r\n          </div>\r\n\r\n          <pdf-viewer style=\"min-height: 47em;\" [src]=\"previewPdf\" [(page)]=\"pdfCurrentPagePreview\" [show-all]=\"false\" [render-text]=\"false\"></pdf-viewer>\r\n        </div>\r\n\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"modal fade\" id=\"editAssignmentModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">Edit Assignment</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <!--\r\n\t\t\t\t\t\t<p *ngIf=\"dataObj.selectedLesson && dataObj.selectedLesson !== undefined\">{{dataObj.selectedLesson.NAME}}</p>\r\n\t\t\t\t\t-->\r\n\r\n\t\t<!--\r\n\t\t<form novalidate [formGroup]=\"editAssignmentGroupForm\" name=\"editAssignmentForm\">\r\n            <fieldset>\r\n              <div class=\"form-group\" [ngClass]=\"displayFieldCss(editAssignmentGroupForm,'start_date')\">\r\n                <label for=\"bookName\">Available from :</label>\r\n                <input type=\"date\" class=\"form-control\" id=\"startDateHelp\" formControlName=\"start_date\" [(ngModel)]=\"editAssignmentForm.start_date\"\r\n                  name=\"start_date\" placeholder=\"Enter available from date\" />\r\n              </div>\r\n\r\n              <div class=\"form-group\" [ngClass]=\"displayFieldCss(editAssignmentGroupForm,'due_date')\">\r\n                <label for=\"dueDateHelp\">Due :</label>\r\n                <input type=\"date\" class=\"form-control\" id=\"dueDateHelp\" formControlName=\"due_date\" [(ngModel)]=\"editAssignmentForm.due_date\"\r\n                  name=\"due_date\" placeholder=\"Enter due date\" />\r\n              </div>\r\n\r\n              <div class=\"form-group\" [ngClass]=\"displayFieldCss(editAssignmentGroupForm,'minute')\">\r\n\r\n                <label>Minimum reading time</label>\r\n                <div class=\"col-md-12 form-inline\">\r\n                  <input type=\"number\" class=\"form-control col-sm-2\" id=\"minuteHelp\" formControlName=\"minute\" [(ngModel)]=\"editAssignmentForm.minute\"\r\n                    name=\"minute\" /> Minute\r\n                  <input type=\"number\" class=\"form-control col-sm-2\" id=\"secondHelp\" formControlName=\"second\" [(ngModel)]=\"editAssignmentForm.second\"\r\n                    name=\"second\" />Seconds\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"comment\">Notes :</label>\r\n                <textarea name=\"comment\" formControlName=\"comment\" [(ngModel)]=\"editAssignmentForm.notes\" id=\"comment\" cols=\"30\" class=\"form-control\"\r\n                  rows=\"4\"></textarea>\r\n              </div>\r\n            </fieldset>\r\n          </form>\r\n\t\t-->\r\n\r\n          <form *ngIf=\"editAssignmentValues != undefined\">\r\n            <fieldset>\r\n              <div class=\"date-labels\">\r\n                <p>Available From: </p>\r\n                <p>Due: </p>\r\n              </div>\r\n              <div class=\"date-inputs\">\r\n                <input type=\"date\" id=\"startDateEdit\" [ngModel]=\"editAssignmentValues.START_DATE | date:'yyyy-MM-dd'\" [ngModelOptions]=\"{standalone: true}\">\r\n                <input type=\"date\" id=\"dueDateEdit\" [ngModel]=\"editAssignmentValues.DUE_DATE | date:'yyyy-MM-dd'\" [ngModelOptions]=\"{standalone: true}\">\r\n              </div>\r\n              <br>\r\n              <p>Minimum reading time: </p>\r\n              <div class=\"reading-time-input\">\r\n                <input type=\"number\" id=\"minutesEdit\" [ngModel]=\"editAssignmentValues.MINUTES\" [ngModelOptions]=\"{standalone: true}\"/>\r\n                <p>minutes</p>\r\n                <input type=\"seconds\" id=\"secondsEdit\" [ngModel]=\"editAssignmentValues.SECONDS\" [ngModelOptions]=\"{standalone: true}\"/>\r\n                <p>seconds</p>\r\n              </div>\r\n              <br>\r\n              <p>Notes</p>\r\n              <textarea style=\"width: 100%\" id=\"notesInputEdit\" rows=\"5\" [ngModel]=\"editAssignmentValues.NOTES\" [ngModelOptions]=\"{standalone: true}\"></textarea>\r\n            </fieldset>\r\n          </form>\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n          <button type=\"button\" class=\"btn btn-primary\" (click)=\"updateAssignment()\" data-dismiss=\"modal\">Update Assignment</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"modal fade\" id=\"emailModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">Send Email</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <label>Recipients</label>\r\n          <input type=\"text\" class=\"form-control form-control-sm\" [(ngModel)]=\"modalEmails\">\r\n          <label>Message</label>\r\n          <textarea class=\"form-control\" rows=\"3\" [(ngModel)]=\"emailContents\"></textarea>\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n          <button type=\"button\" class=\"btn btn-primary\" (click)=\"emailConfirm()\" data-dismiss=\"modal\">Send Email</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"modal fade\" id=\"newLessonModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog modal-lg\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">Add Lesson</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <form>\r\n            <fieldset>\r\n              <div class=\"form-group\">\r\n                <label for=\"lessonTitleInput\">Lesson Title</label>\r\n                <input type=\"text\" class=\"form-control\" id=\"lessonTitleInput\" aria-describedby=\"lessonTitleHelp\" placeholder=\"Enter title\">\r\n                <small id=\"lessonTitleHelp\" class=\"form-text text-muted\">Used to select lesson on new assignment screen</small>\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <label for=\"lessonStart\">Lesson Page Start</label>\r\n                <input type=\"number\" class=\"form-control\" id=\"lessonStart\" aria-describedby=\"lessonStartHelp\" placeholder=\"Enter title\" [(ngModel)]=\"pdfStartPage\"\r\n                  [ngModelOptions]=\"{standalone: true}\">\r\n                <!--<label class=\"btn btn-primary\" id=\"startPageButton\" (click)=\"setStartPage()\">Use Current Page</label>-->\r\n                <small id=\"lessonStartHelp\" class=\"form-text text-muted\"></small>\r\n              </div>\r\n              <div class=\"form-group\">\r\n                <label for=\"lessonEnd\">Lesson Page End</label>\r\n                <input type=\"number\" class=\"form-control\" id=\"lessonEnd\" aria-describedby=\"lessonEndHelp\" placeholder=\"Enter title\" [(ngModel)]=\"pdfEndPage\"\r\n                  [ngModelOptions]=\"{standalone: true}\">\r\n                <!--<label class=\"btn btn-primary\" id=\"endPageButton\" (click)=\"setEndPage()\">Use Current Page</label>-->\r\n                <small id=\"lessonEndHelp\" class=\"form-text text-muted\"></small>\r\n              </div>\r\n            </fieldset>\r\n          </form>\r\n          <!--\r\n\t\t\t\t\t<button class=\"btn btn-primary\" (click)=\"decrementPage()\">Prev</button>\r\n\t\t\t\t\t<input type=\"number\" [(ngModel)]=\"pdfCurrentPage\">\r\n\t\t\t\t\t<button class=\"btn btn-primary\" (click)=\"incrementPage()\">Next</button>\r\n\t\t\t\t\t<pdf-viewer [src]=\"testPdf\" [render-text]=\"false\" [(page)]=\"pdfCurrentPage\" [show-all]=\"false\" [original-size]=\"false\" style=\"display: block;\"></pdf-viewer>\r\n\t\t\t\t\t-->\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n          <button type=\"button\" class=\"btn btn-primary\">Submit Lesson</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"modal fade\" id=\"addGroupModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog modal-lg\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">Add Group</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <form [formGroup]=\"groupForm\" (submit)=\"saveGroup()\">\r\n            <div class=\"form-group\">\r\n              <label for=\"groupNameInput\">Group Name</label>\r\n              <input type=\"text\" formControlName=\"group_name\" class=\"form-control\" id=\"groupNameInput\" aria-describedby=\"groupTitleHelp\"\r\n                placeholder=\"Enter Name\">\r\n            </div>\r\n\r\n            <div class=\"form-group\">\r\n              <label for=\"groupEmailInput\">Emails</label>\r\n              <tag-input type=\"text\" [separatorKeyCodes]='[9, 188]' [placeholder]=\"'Add email'\" [secondaryPlaceholder]=\"'Add email'\" [errorMessages]=\"errorMessages\"\r\n                [validators]=\"validators\" id=\"groupEmailInput\" formControlName=\"emails\" (onAdd)=\"onItemAdded($event)\" [editable]='true'></tag-input>\r\n              <!--<input type=\"text\"-->\r\n              <!--formControlName=\"emails\"-->\r\n              <!--class=\"form-control\" id=\"groupEmailInput\" aria-describedby=\"groupEmailInputHelp\"-->\r\n              <!--placeholder=\"Enter email addresses\">-->\r\n            </div>\r\n          </form>\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n          <button type=\"button\" (click)=\"saveGroup()\" [disabled]=\"groupForm.invalid\" class=\"btn btn-primary\">Add Group</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"modal fade\" id=\"inviteAdminModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog modal-lg\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">Invite admin</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <form [formGroup]=\"inviteAdminForm\" (submit)=\"inviteAdmin()\">\r\n            <div class=\"form-group\">\r\n              <label for=\"groupNameInput\">Admin Email Address</label>\r\n              <input type=\"email\" formControlName=\"email\" class=\"form-control\" id=\"groupNameInput\" aria-describedby=\"groupTitleHelp\" placeholder=\"Enter Email\">\r\n            </div>\r\n          </form>\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n          <button type=\"button\" (click)=\"inviteAdmin()\" [disabled]=\"inviteAdminForm.invalid\" class=\"btn btn-primary\">Invite</button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"modal fade\" id=\"addEmployeeModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog modal-lg\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">Add Employee</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\" *ngIf=\"selectedGroup\">\r\n          <form name=\"employeeform\" novalidate [formGroup]=\"employeeForm\" (submit)=\"saveEmployee()\">\r\n            <!--<div class=\"form-group\">-->\r\n            <!--<label for=\"employeeFirstNameInput\">First Name</label>-->\r\n            <!--<input type=\"text\" style=\"\"-->\r\n            <!--formControlName=\"first_name\"-->\r\n            <!--class=\"form-control\"-->\r\n            <!--id=\"employeeFirstNameInput\"-->\r\n            <!--aria-describedby=\"employeeFirstNameHelp\"-->\r\n            <!--placeholder=\"Enter First Name\">-->\r\n            <!--</div>-->\r\n            <!--<div class=\"form-group\">-->\r\n            <!--<label for=\"employeeLastNameInput\">Last Name</label>-->\r\n            <!--<input type=\"text\" class=\"form-control\"-->\r\n            <!--formControlName=\"last_name\"-->\r\n            <!--id=\"employeeLastNameInput\" aria-describedby=\"employeeLastNameHelp\" placeholder=\"Enter Last Name\">-->\r\n            <!--</div>-->\r\n            <div class=\"form-group\">\r\n              <label for=\"employeeEmailInput\">Email</label>\r\n              <input type=\"text\" formControlName=\"email\" class=\"form-control\" id=\"employeeEmailInput\" aria-describedby=\"employeeEmailHelp\"\r\n                placeholder=\"Enter Email\">\r\n            </div>\r\n          </form>\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n          <button type=\"button\" (click)=\"saveEmployee()\" [disabled]=\"employeeForm.invalid\" class=\"btn btn-primary\">Add Employee\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n\r\n  <div class=\"modal fade\" id=\"newBookModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog modal-lg\" role=\"document\">\r\n      <div class=\"modal-content\" *ngIf=\"bookForm\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\">Add Book</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <form name=\"booksave\" novalidate [formGroup]=\"bookGroupForm\">\r\n            <fieldset>\r\n              <div class=\"form-group\" [ngClass]=\"displayFieldCss(bookGroupForm,'NAME')\">\r\n                <label for=\"bookName\">Book Name</label>\r\n                <input type=\"text\" [(ngModel)]=\"bookForm.NAME\" class=\"form-control\" id=\"bookName\" aria-describedby=\"lessonTitleHelp\" formControlName=\"NAME\"\r\n                  required placeholder=\"Enter book name\">\r\n              </div>\r\n\r\n              <div class=\"form-group\" [ngClass]=\"displayFieldCss(bookGroupForm,'book_file')\">\r\n                <label for=\"bookFile\">File</label>\r\n                <input type=\"file\" class=\"form-control\" id=\"bookFile\" (change)=\"onFileChange($event)\" placeholder=\"Upload book (.pdf)\" accept=\".pdf\">\r\n                <small id=\"bookFileHelp\" class=\"form-text text-muted\">Only upload pdf</small>\r\n                <input type=\"hidden\" name=\"book_file\" formControlName=\"book_file\" />\r\n              </div>\r\n            </fieldset>\r\n          </form>\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n          <button type=\"submit\" [disabled]=\"bookGroupForm.invalid\" (click)=\"saveBook()\" class=\"btn btn-primary\">Submit\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"modal fade\" id=\"newAssignment\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"newAssignmentLabel\" aria-hidden=\"true\">\r\n    <div class=\"modal-dialog modal-lg\" role=\"document\">\r\n      <div class=\"modal-content\" *ngIf=\"selectedGroup && dataObj.selectedLesson\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\">Add Assignment</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <form novalidate [formGroup]=\"assignmentGroupForm\" name=\"assignmentForm\">\r\n            <fieldset>\r\n              <div class=\"form-group\" [ngClass]=\"displayFieldCss(assignmentGroupForm,'start_date')\">\r\n                <label for=\"bookName\">Available from :</label>\r\n                <input type=\"date\" class=\"form-control\" id=\"startDateHelp\" formControlName=\"start_date\" [(ngModel)]=\"assignmentForm.start_date\"\r\n                  name=\"start_date\" placeholder=\"Enter available from date\" />\r\n              </div>\r\n\r\n              <div class=\"form-group\" [ngClass]=\"displayFieldCss(assignmentGroupForm,'due_date')\">\r\n                <label for=\"dueDateHelp\">Due :</label>\r\n                <input type=\"date\" class=\"form-control\" id=\"dueDateHelp\" formControlName=\"due_date\" [(ngModel)]=\"assignmentForm.due_date\"\r\n                  name=\"due_date\" placeholder=\"Enter due date\" />\r\n              </div>\r\n\r\n              <div class=\"form-group\" [ngClass]=\"displayFieldCss(assignmentGroupForm,'minute')\">\r\n\r\n                <label>Minimum reading time</label>\r\n                <div class=\"col-md-12 form-inline\">\r\n                  <input type=\"number\" class=\"form-control col-sm-2\" id=\"minuteHelp\" formControlName=\"minute\" [(ngModel)]=\"assignmentForm.minute\"\r\n                    name=\"minute\" /> Minute\r\n                  <input type=\"number\" class=\"form-control col-sm-2\" id=\"secondHelp\" formControlName=\"second\" [(ngModel)]=\"assignmentForm.second\"\r\n                    name=\"second\" />Seconds\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"comment\">Notes :</label>\r\n                <textarea name=\"comment\" formControlName=\"comment\" [(ngModel)]=\"assignmentForm.notes\" id=\"comment\" cols=\"30\" class=\"form-control\"\r\n                  rows=\"4\"></textarea>\r\n              </div>\r\n            </fieldset>\r\n          </form>\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\r\n          <button type=\"submit\" [disabled]=\"!assignmentGroupForm.valid\" (click)=\"saveAssignment()\" class=\"btn btn-primary\">Start Assignment\r\n          </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n  <div class=\"modal fade\" id=\"beforeChangePageOrBook\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"beforeChangePageOrBook\"\r\n    aria-hidden=\"true\">\r\n    <div class=\"modal-dialog modal-lg\" role=\"document\">\r\n      <div class=\"modal-content\">\r\n        <div class=\"modal-header\">\r\n          <h5 class=\"modal-title\">\r\n            <i class=\"fa fa-info\"></i>Info</h5>\r\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\r\n            <span aria-hidden=\"true\">&times;</span>\r\n          </button>\r\n        </div>\r\n        <div class=\"modal-body\">\r\n          <p>\r\n            Are you sure to discard current changes ?\r\n          </p>\r\n        </div>\r\n        <div class=\"modal-footer\">\r\n          <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\" (click)=\"discardAction(false)\">No</button>\r\n          <button type=\"button\" class=\"btn btn-primary\" (click)=\"discardAction(true)\" data-dismiss=\"modal\">Yes </button>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n\r\n</div>\r\n\r\n<div class=\"container\" *ngIf=\"isLoggedIn && admin_id == 0\">\r\n  <h1>Welcome to Liberty Elevator Safety Training</h1>\r\n  <p>This page has instructions for downloading and installing the app on your Android device.</p>\r\n  <p>Follow these instructions to begin receiving learning materials.</p>\r\n  <ol>\r\n    <li>Adjust settings to allow downloads from unknown sources</li>\r\n    <li>Download and install the application</li>\r\n    <li>Sign in and begin reading</li>\r\n  </ol>\r\n  <button type=\"button\" class=\"btn-primary\" (click)=\"getApk()\"> Download App</button>\r\n</div>\r\n"

/***/ }),

/***/ "../../../../../src/app/employees/employees.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmployeesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/esm5/forms.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("../../../common/esm5/http.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__employees_service__ = __webpack_require__("../../../../../src/app/employees.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lesson__ = __webpack_require__("../../../../../src/app/lesson.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__book_service__ = __webpack_require__("../../../../../src/app/book.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ngx_toastr__ = __webpack_require__("../../../../ngx-toastr/esm5/ngx-toastr.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__auth_service__ = __webpack_require__("../../../../../src/app/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_file_saver__ = __webpack_require__("../../../../file-saver/FileSaver.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_file_saver___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_file_saver__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var EmployeesComponent = /** @class */ (function () {
    function EmployeesComponent(employeesService, toastrService, authService, bookService, fb) {
        this.dataObj = {
            books: [],
            employee_status: [],
            book_lessons: [],
            selected_group: null,
            selectedBook: null,
            selectedLessonPlan: null,
            selectedLesson: null,
            selectedAssignment: null,
        };
        this.isLoggedIn = false;
        this.isLoginError = false;
        this.newBookAdded = false;
        this.newUser = false;
        this.loginErrorMessage = "";
        this.admin_password = "";
        this.url = "";
        this.newPassword = "";
        this.confirmPassword = "";
        this.firstName = "";
        this.lastName = "";
        this.newUserFirstName = "";
        this.newUserLastName = "";
        this.newUserPhoneNumber = "";
        this.admin_id = -1;
        this.viewPdf = false;
        this.lookAtAssignments = true;
        this.newUserError = undefined;
        this.bookForm = null;
        this.groupForm = __WEBPACK_IMPORTED_MODULE_1__angular_forms__["d" /* FormGroup */];
        this.inviteAdminForm = __WEBPACK_IMPORTED_MODULE_1__angular_forms__["d" /* FormGroup */];
        this.assignmentForm = null;
        this.newUserObject = null;
        this.sortAscending = true;
        this.sortDescending = true;
        this.validators = [this.validateEmail];
        this.errorMessages = {
            'validateEmail': 'invalid email address'
        };
        this.currentDate = new Date();
        var testDate = new Date();
        testDate = new Date(testDate.setDate(new Date().getDate() - 3));
        this.warningDate = testDate;
        this.fb = fb;
        this.employeesService = employeesService;
        this.bookService = bookService;
        this.authService = authService;
        this.toastrService = toastrService;
        this.userEmail = "";
        this.userPassword = "";
        this.isLoginError = false;
        this.newUser = false;
        this.loginErrorMessage = "";
        this.admin_password = "";
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
        this.emailContents = "";
        this.lookAtAssignments = true;
        this.resetForm();
        this.reactiveFormGroup();
        document.getElementsByTagName('body')[0].style.backgroundColor = '#89CFF0';
    }
    EmployeesComponent.prototype.onAdminLogin = function (admin_id) {
        var _this = this;
        this.employeesService.getUserData(admin_id).subscribe(function (userData) {
            _this.employeesService.getGroups(admin_id).subscribe(function (groups) {
                _this.groups = groups;
                _this.selectedGroup = groups[0] || null;
                console.log(_this.selectedGroup);
                _this.transformResponseAndPopulate();
                _this.employeesService.getAssignments(_this.selectedGroup.ID).subscribe(function (assignments) {
                    console.log(_this.selectedGroup);
                    if (assignments && assignments.hasOwnProperty('err')) {
                        _this.assignments = [{
                                "assignment_id": -1,
                                "NAME": "No assignments",
                                "START_DATE": null,
                                "DUE_DATE": null,
                                "book_id": -1,
                                "lesson_id": -1,
                                "NOTES": "",
                                "TIME_TO_COMPLETE": 0
                            }];
                        _this.selectedAssignment = assignments[0];
                        _this.editAssignmentValues = { 'START_DATE': _this.selectedAssignment.START_DATE, 'DUE_DATE': _this.selectedAssignment.DUE_DATE, 'MINUTES': _this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS': _this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES': _this.selectedAssignment.NOTES };
                        _this.countdown = new Date(1970, 0, 1).setSeconds(0);
                        if (_this.selectedGroup && _this.selectedAssignment) {
                            _this.employeesService.getEmployees(_this.selectedGroup.ID, -1).subscribe(function (employees) {
                                _this.employees = employees;
                            });
                        }
                    }
                    else {
                        _this.assignments = assignments;
                        _this.selectedAssignment = assignments[0];
                        _this.editAssignmentValues = { 'START_DATE': _this.selectedAssignment.START_DATE, 'DUE_DATE': _this.selectedAssignment.DUE_DATE, 'MINUTES': _this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS': _this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES': _this.selectedAssignment.NOTES };
                        _this.countdown = new Date(1970, 0, 1).setSeconds(_this.selectedAssignment.TIME_TO_COMPLETE);
                        if (_this.selectedGroup && _this.selectedAssignment) {
                            _this.employeesService.getEmployees(_this.selectedGroup.ID, _this.selectedAssignment.assignment_id).subscribe(function (employees) {
                                _this.employees = employees;
                                var complete = 0;
                                var total = employees.length;
                                for (var i = 0; i < employees.length; i++) {
                                    console.log(employees[i]);
                                    if (employees[i].IS_COMPLETE !== null) {
                                        if (employees[i].IS_COMPLETE.data[0] === 1) {
                                            complete = complete + 1;
                                        }
                                    }
                                }
                                if (complete === 0) {
                                    _this.selectedAssignmentCompletion = 0 + "%";
                                }
                                else {
                                    _this.selectedAssignmentCompletion = Math.floor((complete / total) * 100) + "%";
                                }
                            });
                        }
                        _this.loadAssignmentPreview();
                    }
                    _this.loadAssignmentPreview();
                });
            });
        });
    };
    EmployeesComponent.prototype.transformLessonModel = function (tempLession) {
        return new __WEBPACK_IMPORTED_MODULE_4__lesson__["a" /* Lesson */](tempLession.ID, tempLession.NAME, tempLession.BOOK_ID, tempLession.START_PAGE, tempLession.END_PAGE, tempLession.PDF_FILE, tempLession.ASSIGNMENTS_GROUP_IDS);
    };
    EmployeesComponent.prototype.transformResponseAndPopulate = function () {
        var _this = this;
        this.bookService.getStatuses().subscribe(function (res) {
            _this.dataObj.employee_status = res;
        });
        this.employeesService.getBooks().subscribe(function (res) {
            var bookMapping = function (books, lessons) {
                return books.map(function (book) {
                    book.LESSONS = lessons.filter(function (lesson) { return lesson.BOOK_ID == book.ID; }).map(function (tempLession) {
                        return _this.transformLessonModel(tempLession);
                    });
                    return book;
                });
            };
            console.log("Group ID");
            console.log(_this.selectedGroup.ID);
            if (_this.selectedGroup !== undefined && _this.selectedGroup !== null) {
                _this.employeesService.getLessons(_this.selectedGroup.ID).subscribe(function (data) {
                    _this.dataObj.books = bookMapping(res.books, data);
                    _this.dataObj.selectedBook = _this.dataObj.books[0];
                    _this.selectedBook = _this.dataObj.books[0].ID;
                    _this.updatePdfBookPreview();
                }, function (err) {
                    _this.dataObj.books = bookMapping(res.books, []);
                    _this.dataObj.selectedBook = _this.dataObj.books[0];
                    _this.selectedBook = _this.dataObj.books[0].ID;
                    _this.updatePdfBookPreview();
                });
            }
            else {
                _this.dataObj.books = bookMapping(res.books, []);
                _this.dataObj.selectedBook = _this.dataObj.books[0];
                _this.selectedBook = _this.dataObj.books[0].ID;
                _this.updatePdfBookPreview();
            }
        });
    };
    EmployeesComponent.prototype.updatePdfBookPreview = function () {
        this.testPdf = {
            url: this.bookService._api.endpoint + "/read-pdf?path=" + this.dataObj.selectedBook.PDF_FILE,
            withCredentials: false
        };
    };
    EmployeesComponent.prototype.onFileChange = function ($event) {
        var file = null;
        if ($event.target.files.length > 0) {
            file = $event.target.files[0]; // <--- File Object for future use.
        }
        this.bookGroupForm.controls['book_file'].setValue(file ? file.name : '');
    };
    EmployeesComponent.prototype.isFieldValid = function (form, field) {
        return !form.get(field).valid && form.get(field).touched;
    };
    EmployeesComponent.prototype.validateEmail = function (control) {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(control.value))) {
            return {
                'invalidEmail': true
            };
        }
        return null;
    };
    EmployeesComponent.prototype.onItemAdded = function (event) {
        console.log('event', event, this.validateEmail(event.value));
    };
    EmployeesComponent.prototype.displayFieldCss = function (form, field) {
        return {
            'has-error': this.isFieldValid(form, field),
            'has-feedback': this.isFieldValid(form, field)
        };
    };
    EmployeesComponent.prototype.reactiveFormGroup = function () {
        this.assignmentGroupForm = this.fb.group({
            start_date: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required),
            due_date: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required),
            minute: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required),
            second: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](),
            comment: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](),
        });
        this.editAssignmentGroupForm = this.fb.group({
            start_date: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required),
            due_date: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required),
            minute: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required),
            second: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](),
            comment: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](),
        });
        this.bookGroupForm = this.fb.group({
            NAME: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required),
            book_file: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required),
        });
        this.employeeForm = this.fb.group({
            email: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].email]),
        });
        this.groupForm = this.fb.group({
            group_name: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required]),
            emails: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required]),
        });
        this.inviteAdminForm = this.fb.group({
            email: new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["c" /* FormControl */](null, [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["h" /* Validators */].required]),
        });
    };
    EmployeesComponent.prototype.initialLoad = function () {
        // this.bookService.getBooks().subscribe((data: any) => {
        //     this.books = data.books;
        //     this.selectedBook = this.books[0].ID;
        //     this.selectedBookData = this.books[0];
        //     this.refreshBookLessons(this.selectedBook);
        // });
    };
    EmployeesComponent.prototype.selectLesson = function (lesson) {
        this.dataObj.selectedLesson = lesson;
        console.log('lesson', lesson);
    };
    EmployeesComponent.prototype.resetForm = function () {
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
    };
    EmployeesComponent.prototype.saveBook = function () {
        var _this = this;
        // console.log('ss',this.bookForm);
        // let input = document.getElementById('bookName');
        // file = input.files[0];
        var fileList = $('#bookFile').prop('files');
        if (fileList.length > 0) {
            var file = fileList[0];
            var formData = new FormData();
            formData.append('book_file', file, 'public/book_files/' + file.name);
            formData.append('file_name', 'public/book_files/' + file.name);
            formData.append('file_size', "" + file.size);
            formData.append('file_type', file.type);
            formData.append('book_name', this.bookForm.NAME);
            this.bookService.saveBooks(formData).subscribe(function (res) {
                if (res.data && res.data.ID) {
                    var newBook = res.data;
                    _this.dataObj.books.push(newBook);
                    _this.selectedBook = newBook.ID;
                    _this.dataObj.selectedBook = newBook;
                    _this.newBookAdded = true;
                    _this.updatePdfBookPreview();
                    _this.dataObj.selectedLesson = null;
                }
                _this.toastrService.success('Book', 'Saved');
                $('#newBookModal').modal('hide');
            }, function (err) {
                _this.toastrService.success('Book', 'Save fail');
            });
        }
        else {
            this.toastrService.success('Book', 'Enter proper data');
        }
    };
    EmployeesComponent.prototype.saveAssignment = function () {
        var _this = this;
        if (this.assignmentGroupForm.invalid) {
            this.toastrService.warning('Assignment', 'Enter proper data!');
            return;
        }
        var minute = 0;
        var seconds = 0;
        if (this.assignmentForm.minute) {
            minute = this.assignmentForm.minute;
        }
        if (this.assignmentForm.second) {
            seconds = this.assignmentForm.second;
        }
        this.assignmentForm.time_to_complete = (minute * 60) + (seconds);
        this.assignmentForm.group_id = this.selectedGroup.ID;
        this.assignmentForm.lesson_id = this.dataObj.selectedLesson.ID;
        var name = this.dataObj.selectedLesson.NAME;
        var dataForm = {
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
        this.bookService.saveAssignment(this.assignmentForm.lesson_id, dataForm).subscribe(function (res) {
            console.log('res', res);
            if (res.status && res.data && res.data.ID) {
                var notes = dataForm.NOTES;
                var assign = {
                    NAME: name,
                    lesson_id: dataForm.LESSON_ID,
                    book_id: _this.dataObj.selectedLesson.BOOK_ID,
                    DUE_DATE: _this.assignmentForm.due_date,
                    START_DATE: _this.assignmentForm.start_date,
                    NOTES: _this.assignmentForm.notes,
                    assignment_id: res.data.ID,
                    TIME_TO_COMPLETE: _this.assignmentForm.time_to_complete
                };
                console.log('NEW assignMENT', assign);
                if (_this.assignments.length > 0 && _this.assignments[0].assignment_id == -1) {
                    _this.assignments.splice(0, 1);
                }
                if (!_this.assignments) {
                    _this.assignments = [];
                }
                _this.assignments.push(assign);
                _this.selectedAssignment = assign;
                _this.editAssignmentValues = { 'START_DATE': _this.selectedAssignment.START_DATE, 'DUE_DATE': _this.selectedAssignment.DUE_DATE, 'MINUTES': _this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS': _this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES': _this.selectedAssignment.NOTES };
                _this.countdown = new Date(1970, 0, 1).setSeconds(_this.selectedAssignment.TIME_TO_COMPLETE);
                _this.dataObj.selectedBook.LESSONS.forEach(function (item) {
                    if (item.ID == dataForm.LESSON_ID) {
                        console.log('itemitem', item);
                        item.setGroup(_this.selectedGroup.ID);
                        item.setIsAssigned(true);
                    }
                });
                _this.assignmentGroupForm.reset();
                _this.resetForm();
                console.log('this.assignments', _this.assignments);
                _this.toastrService.success('Assignment', 'Saved');
                $('#newAssignment').modal('hide');
            }
            else {
                _this.toastrService.warning('Assignment', 'Please enter proper data');
            }
        }, function (err) {
            _this.toastrService.warning('Assignment', 'Internal server error');
        });
    };
    EmployeesComponent.prototype.addLesson = function () {
        if (this.dataObj.selectedBook) {
            if (!this.dataObj.selectedBook.LESSONS) {
                this.dataObj.selectedBook.LESSONS = [];
            }
            this.dataObj.selectedBook.LESSONS.push(new __WEBPACK_IMPORTED_MODULE_4__lesson__["a" /* Lesson */](null, '', this.dataObj.selectedBook.ID, null, null, ''));
        }
        else {
            this.toastrService.warning('Lesson', 'Please select book');
        }
    };
    EmployeesComponent.prototype.createLesson = function (title, pageStart, pageEnd) {
        if (this.dataObj.selectedBook) {
            if (!this.dataObj.selectedBook.LESSONS) {
                this.dataObj.selectedBook.LESSONS = [];
            }
            //this.dataObj.selectedBook.LESSONS.push(new Lesson(null, title, this.dataObj.selectedBook.ID, pageStart, pageEnd, this.selectedGroup.ID))
        }
    };
    EmployeesComponent.prototype.discardAction = function (status) {
        if (status) {
            // do the right thing...
        }
        else {
            /// continuee next process...
        }
    };
    EmployeesComponent.prototype.saveEmployee = function () {
        var _this = this;
        if (this.employeeForm.invalid) {
            this.toastrService.warning('Employee', 'Enter proper data');
            return;
        }
        var dataEmployee = {
            FIRST_NAME: '',
            LAST_NAME: '',
            group_name: this.selectedGroup.NAME,
            GROUP_ID: this.selectedGroup.ID,
            EMAIL: this.employeeForm.value.email
        };
        console.log(this.employeeForm.value);
        this.bookService.saveEmployee(this.selectedGroup.ID, dataEmployee).subscribe(function (res) {
            console.log('this.employees', _this.employees);
            if (res.employees && res.employees.length > 0 && res.employees[0].ID) {
                _this.employeeForm.reset();
                if (res.data.length) {
                    var emp = _this.employees.filter(function (item) {
                        return item.ID == res.data[0]['USER_ID'];
                    });
                    if (emp.length == 0) {
                        _this.employees.push(Object.assign(res.employees[0], {
                            IS_COMPLETE: null
                        }));
                        _this.toastrService.success('Employee', 'Saved');
                    }
                    else {
                        _this.toastrService.success('Employee', 'Already Added');
                    }
                }
                // if (res.is_new) {
                //     this.toastrService.success('Employee', 'Saved');
                // } else {
                //     this.toastrService.success('Employee', 'Group assign to employee');
                // }
                $('#addEmployeeModal').modal('hide');
            }
            else {
                _this.toastrService.warning('Employee', 'Save Failed');
            }
        }, function (err) {
            _this.toastrService.warning('Employee', 'Save Failed');
        });
    };
    EmployeesComponent.prototype.saveGroup = function () {
        var _this = this;
        if (this.groupForm.invalid) {
            this.toastrService.warning('Employee', 'Enter proper data');
            return;
        }
        var groupData = {
            NAME: this.groupForm.value.group_name,
            employees: this.groupForm.value.emails.map(function (item) {
                return {
                    FIRST_NAME: '',
                    LAST_NAME: '',
                    EMAIL: item.value
                };
            }),
            ADMIN_ID: this.admin_id
        };
        this.bookService.saveGroup(groupData).subscribe(function (res) {
            console.log("AAAAA");
            if (res && !res.status && res.message) {
                _this.toastrService.warning('Group', res.message);
                console.log("BBBBB");
            }
            else {
                console.log("CCCCC");
                if (res.data && res.data.length > 0) {
                    var newGroup = {
                        ID: res.data[0].ID,
                        NAME: res.data[0].NAME
                    };
                    _this.groups.push(newGroup);
                    _this.groupSelect(newGroup);
                    console.log("DDDDD");
                }
                console.log("EEEEE");
                _this.toastrService.success('Group', 'Saved');
                _this.groupForm.reset();
                $('#addGroupModal').modal('hide');
                console.log("Success add groups");
                //this.onAdminLogin(this.admin_id);
            }
        }, function (err) {
            _this.toastrService.warning('Group', 'Internal server error');
        });
    };
    EmployeesComponent.prototype.makepass = function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    };
    EmployeesComponent.prototype.toggleMenu = function () {
        if (document.getElementById('adminMenu').style.display === 'block') {
            document.getElementById('adminMenu').style.display = 'none';
        }
        else {
            document.getElementById('adminMenu').style.display = 'block';
        }
    };
    EmployeesComponent.prototype.inviteAdminAction = function () {
        document.getElementById('adminMenu').style.display = 'none';
    };
    EmployeesComponent.prototype.inviteAdmin = function () {
        var _this = this;
        document.getElementById('adminMenu').style.display = 'none';
        if (this.inviteAdminForm.invalid) {
            this.toastrService.warning('Invite', 'Enter Email address');
            return;
        }
        this.admin_password = this.makepass();
        var inviteData = {
            email: this.inviteAdminForm.value.email,
            pass: this.admin_password
        };
        this.employeesService.sendInvitationAdmin(inviteData).subscribe(function (res) {
            if (res && !res.status && res.message) {
                _this.toastrService.warning('Invite', res.message);
            }
            else {
                //console.log(inviteData.email);
                //console.log(inviteData.pass);
                _this.authService.signUpRegular(inviteData.email, inviteData.pass).then(function (data) {
                    _this.toastrService.success('Invite', 'Success');
                    _this.inviteAdminForm.reset();
                    $('#inviteAdminModal').modal('hide');
                })
                    .catch(function (err) {
                    _this.toastrService.warning('Invite', 'Internal server error');
                });
            }
        }, function (err) {
            _this.toastrService.warning('Invite', 'Internal server error');
        });
    };
    EmployeesComponent.prototype.inviteUser = function () {
        var _this = this;
        document.getElementById('adminMenu').style.display = 'none';
        if (this.inviteAdminForm.invalid) {
            this.toastrService.warning('Invite', 'Enter Email address');
            return;
        }
        this.admin_password = this.makepass();
        var inviteData = {
            email: this.inviteAdminForm.value.email,
            pass: this.admin_password
        };
        this.employeesService.sendInvitationUser(inviteData).subscribe(function (res) {
            if (res && !res.status && res.message) {
                _this.toastrService.warning('Invite', res.message);
            }
            else {
                _this.authService.signUpRegular(inviteData.email, inviteData.pass).then(function (data) {
                    _this.toastrService.success('Invite', 'Success');
                    _this.inviteAdminForm.reset();
                    $('#inviteAdminModal').modal('hide');
                })
                    .catch(function (err) {
                    _this.toastrService.warning('Invite', 'Internal server error');
                });
            }
        }, function (err) {
            _this.toastrService.warning('Invite', 'Internal server error');
        });
    };
    EmployeesComponent.prototype.removeAssignment = function (assignment) {
        var _this = this;
        this.bookService.removeAssignmentFromGroup({
            GROUP_ID: this.selectedGroup.ID,
            LESSON_ID: assignment.lesson_id
        }).subscribe(function (res) {
            if (res.data && res.data.deleted_assignments && res.data.deleted_assignments.length > 0) {
                var assignmentIds_1 = res.data.deleted_assignments.filter(function (item) {
                    if (item.res && item.res.status) {
                        return true;
                    }
                }).map(function (item) {
                    return item.res.deleted;
                });
                if (assignmentIds_1.length > 0) {
                    _this.toastrService.success('Assignment deleted');
                    _this.assignments = _this.assignments.filter(function (a) {
                        return !(assignmentIds_1.indexOf(a.assignment_id) > -1);
                    });
                    _this.selectedAssignment = {
                        "assignment_id": -1,
                        "NAME": "No assignments",
                        "START_DATE": null,
                        "DUE_DATE": null,
                        "NOTES": "",
                        "book_id": -1,
                        "lesson_id": -1,
                        "TIME_TO_COMPLETE": 0
                    };
                    if (_this.assignments.length == 0) {
                        _this.assignments = [{
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
                        _this.editAssignmentValues = { 'START_DATE': _this.selectedAssignment.START_DATE, 'DUE_DATE': _this.selectedAssignment.DUE_DATE, 'MINUTES': _this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS': _this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES': _this.selectedAssignment.NOTES };
                        _this.countdown = new Date(1970, 0, 1).setSeconds(_this.selectedAssignment.TIME_TO_COMPLETE);
                    }
                    for (var j = 0; j < _this.dataObj.selectedBook.LESSONS.length; j++) {
                        if (_this.dataObj.selectedBook.LESSONS[j].ID === assignment.lesson_id) {
                            _this.dataObj.selectedBook.LESSONS[j].removeAssingGroup(_this.selectedGroup.ID);
                        }
                    }
                }
            }
        }, function (err) {
            _this.toastrService.warning('Whoops, something went wrong!');
        });
    };
    EmployeesComponent.prototype.onPdfLoadError = function (event) {
        this.toastrService.warning('PDF', 'Pdf does not have data');
        this.testPdf = null;
        console.log('onPdfLoadError event', event);
    };
    EmployeesComponent.prototype.generateLessonPlan = function (pdf) {
        var self = this;
        // loop through table of contents to automatically generate a lesson plan for a newly uploaded book
        if (this.newBookAdded) {
            var maxPages = pdf.numPages;
            var countPromises = []; // collecting all page promises
            for (var j = 1; j <= maxPages; j++) {
                var page = pdf.getPage(j);
                var txt = "";
                countPromises.push(page.then(function (page) {
                    var textContent = page.getTextContent();
                    return textContent.then(function (text) {
                        return text.items.map(function (s) { return s.str; }); // value page text
                    });
                }));
            }
            // Wait for all pages and join text
            return Promise.all(countPromises).then(function (texts) {
                if (!self.dataObj.selectedBook.LESSONS) {
                    self.dataObj.selectedBook.LESSONS = [];
                }
                var titleRegex = /(\d+\.?\d*)[\s\–]+(\w+(\-| |\(|\))*)+/g, titleSecondLineRegex = /^(?!Section)((\D\s*\w+)(\-| )*)+/g, elipsesRegex = /^( *\.){2,}/g, pageNumberRegex = /^\d+ ?(?!\.)/;
                var lessons = [];
                var lesson = {};
                var title = "";
                var lessonFinished = false, endOfIndex = false, indexStarted = false;
                for (var i = 0; i < texts.length; i++) {
                    //scan pages
                    if (endOfIndex) {
                        break;
                    }
                    for (var j = 0; j < texts[i].length; j++) {
                        //scan word groups
                        var textSnippet = texts[i][j];
                        if (textSnippet == 'TABLE OF CONTENTS') {
                            indexStarted = true;
                        }
                        else if (textSnippet == "Index") {
                            endOfIndex = true;
                        }
                        else if (indexStarted) {
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
                            }
                            else if (titleSecondLineRegex.test(textSnippet)) {
                                //second line in title found
                                lesson['title'] += " " + textSnippet.match(titleSecondLineRegex);
                            }
                            else if (pageNumberRegex.test(textSnippet)) {
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
                for (var i_1 = 0; i_1 < lessons.length; i_1++) {
                    self.dataObj.selectedBook.LESSONS.push(new __WEBPACK_IMPORTED_MODULE_4__lesson__["a" /* Lesson */](null, lessons[i_1].title, self.dataObj.selectedBook.ID, lessons[i_1].startPage, lessons[i_1].endPage, ''));
                }
            });
        }
    };
    EmployeesComponent.prototype.getLessonPlan = function () {
        return this;
    };
    EmployeesComponent.prototype.onChangeBook = function (event) {
        var _this = this;
        var book = this.dataObj.books.filter(function (item) { return item.ID == _this.selectedBook; });
        if (book.length > 0) {
            // this.selectedBookData = book[0];
            this.dataObj.selectedBook = book[0];
            this.testPdf = {
                url: this.bookService._api.endpoint + "/read-pdf?path=" + this.dataObj.selectedBook.PDF_FILE,
                withCredentials: false
            };
        }
        this.dataObj.selectedLesson = null;
        // this.refreshBookLessons(this.selectedBook);
        // $('#beforeChangePageOrBook').modal();
    };
    EmployeesComponent.prototype.togglePdfPreview = function () {
        console.log('toggle preview');
        if (this.viewPdf) {
            this.viewPdf = false;
            document.getElementById('thirdColumn').className = 'col-xl-10';
            document.getElementById('fourthColumn').className = 'col-xl-0';
            document.getElementById('fourthColumn').style.display = 'none';
        }
        else {
            this.viewPdf = true;
            this.viewAssignments = false;
            document.getElementById('secondColumn').className = 'col-xl-0';
            document.getElementById('thirdColumn').className = 'col-xl-6';
            document.getElementById('fourthColumn').className = 'col-xl-4';
            document.getElementById('fourthColumn').style.display = 'block';
        }
    };
    EmployeesComponent.prototype.loadAssignmentPreview = function () {
        var lesson;
        var book = [];
        for (var i = 0; i < this.dataObj.books.length; i++) {
            if (this.dataObj.books[i].ID === this.selectedAssignment.book_id) {
                book.push(this.dataObj.books[i]);
                for (var j = 0; j < this.dataObj.books[i].LESSONS.length; j++) {
                    if (this.dataObj.books[i].LESSONS[j].ID === this.selectedAssignment.lesson_id) {
                        lesson = this.dataObj.books[i].LESSONS[j];
                    }
                }
            }
        }
        this.previewPdf = {
            url: this.bookService._api.endpoint + "/read-pdf?path=" + book[0].PDF_FILE,
            withCredentials: false
        };
        this.pdfCurrentPagePreviewMax = book[0].TOTAL_PAGES + "";
        this.pdfCurrentPagePreview = lesson.START_PAGE + "";
    };
    EmployeesComponent.prototype.changedPdfPageNoPreview = function (pageNo) {
        console.log('change');
        /*
        if (pageNo != null && pageNo !== '' && pageNo <= this.dataObj.selectedBook.TOTAL_PAGES) {
            this.pdfCurrentPage = pageNo;
        }
        */
    };
    EmployeesComponent.prototype.incrementPagePreview = function () {
        console.log('inc');
        this.pdfCurrentPagePreview = String(Number(this.pdfCurrentPagePreview) + 1);
    };
    EmployeesComponent.prototype.decrementPagePreview = function () {
        console.log('dec');
        this.pdfCurrentPagePreview = String(Number(this.pdfCurrentPagePreview) - 1);
    };
    EmployeesComponent.prototype.changePdfPageNo = function (pageNo) {
        if (pageNo != null && pageNo !== '' && pageNo <= this.dataObj.selectedBook.TOTAL_PAGES) {
            this.pdfCurrentPage = pageNo;
        }
    };
    EmployeesComponent.prototype.saveLessons = function () {
        var _this = this;
        var new_lessons = this.dataObj.selectedBook.LESSONS.filter(function (item) {
            var validation = item.NAME != '' && item.START_PAGE > 0 && item.END_PAGE > 0;
            if ((item.changed_state && item.validationCheck(_this.dataObj.selectedBook.TOTAL_PAGES) && validation) || (item.ID == null && validation)) {
                return true;
            }
            else {
                return false;
            }
        }).map(function (item) {
            return {
                ID: item.ID,
                NAME: item.NAME,
                action: item.ID ? 'existing' : 'new',
                BOOK_ID: item.BOOK_ID,
                BOOK_FILE_PDF: _this.dataObj.selectedBook.PDF_FILE,
                END_PAGE: item.END_PAGE == null ? 0 : item.END_PAGE,
                PDF_FILE: item.PDF_FILE,
                START_PAGE: item.START_PAGE == null ? 0 : item.START_PAGE
            };
        });
        var data = {
            lessons: new_lessons,
            group_id: this.selectedGroup.ID,
            book_id: this.dataObj.selectedBook.ID,
        };
        if (new_lessons.length > 0) {
            this.bookService.batchSaveLesson(data).subscribe(function (lessonsRes) {
                var newLessons = lessonsRes.results.filter(function (item) { return item.action == 'new'; }).map(function (item) {
                    return _this.transformLessonModel(item);
                });
                var updatedLessons = lessonsRes.results.filter(function (item) { return item.action == 'exsting'; }).map(function (item) {
                    return _this.transformLessonModel(item);
                });
                _this.dataObj.selectedBook.LESSONS = _this.dataObj.selectedBook.LESSONS.filter(function (lesson) { return lesson.ID != null; }).concat(newLessons);
                _this.dataObj.selectedBook.LESSONS.forEach(function (item, key) {
                    updatedLessons.forEach(function (editLesson, eKey) {
                        if (item.ID == editLesson.ID) {
                            _this.dataObj.selectedBook.LESSONS[key] = editLesson;
                        }
                    });
                });
                _this.toastrService.success('Lesson', 'Saved');
                // this.refreshBookLessons(this.selectedBook);
            });
        }
        else {
            this.toastrService.warning('Lesson', 'Enter proper data');
        }
    };
    EmployeesComponent.prototype.saveDeleteLesosns = function () {
        var _this = this;
        var new_lessons = this.dataObj.selectedBook.LESSONS.filter(function (item) {
            var validation = item.NAME != '' && item.START_PAGE > 0 && item.END_PAGE > 0;
            if ((item.changed_state && item.validationCheck(_this.dataObj.selectedBook.TOTAL_PAGES) && validation) || (item.ID == null && validation)) {
                return true;
            }
            else {
                return false;
            }
        }).map(function (item) {
            return {
                ID: item.ID,
                NAME: item.NAME,
                action: item.ID ? 'existing' : 'new',
                BOOK_ID: item.BOOK_ID,
                BOOK_FILE_PDF: _this.dataObj.selectedBook.PDF_FILE,
                END_PAGE: item.END_PAGE == null ? 0 : item.END_PAGE,
                PDF_FILE: item.PDF_FILE,
                START_PAGE: item.START_PAGE == null ? 0 : item.START_PAGE
            };
        });
        var data = {
            lessons: new_lessons,
            group_id: this.selectedGroup.ID,
            book_id: this.dataObj.selectedBook.ID,
        };
        this.bookService.batchSaveLesson(data).subscribe(function (lessonsRes) {
            var newLessons = lessonsRes.results.filter(function (item) { return item.action == 'new'; }).map(function (item) {
                return _this.transformLessonModel(item);
            });
            var updatedLessons = lessonsRes.results.filter(function (item) { return item.action == 'exsting'; }).map(function (item) {
                return _this.transformLessonModel(item);
            });
            _this.dataObj.selectedBook.LESSONS = _this.dataObj.selectedBook.LESSONS.filter(function (lesson) { return lesson.ID != null; }).concat(newLessons);
            _this.dataObj.selectedBook.LESSONS.forEach(function (item, key) {
                updatedLessons.forEach(function (editLesson, eKey) {
                    if (item.ID == editLesson.ID) {
                        _this.dataObj.selectedBook.LESSONS[key] = editLesson;
                    }
                });
            });
            _this.toastrService.success('Lesson', 'Saved');
            // this.refreshBookLessons(this.selectedBook);
        });
    };
    EmployeesComponent.prototype.deleteSelected = function () {
        if (this.dataObj.selectedBook.LESSONS) {
            var lessionIds = this.dataObj.selectedBook.LESSONS.filter(function (item) { return item.is_checked == true && item.ID != null; }).map(function (item) { return item.ID; });
            this.dataObj.selectedBook.LESSONS = this.dataObj.selectedBook.LESSONS.filter(function (item) { return item.is_checked == false; });
        }
    };
    EmployeesComponent.prototype.incrementPage = function () {
        this.pdfCurrentPage = String(Number(this.pdfCurrentPage) + 1);
    };
    EmployeesComponent.prototype.decrementPage = function () {
        this.pdfCurrentPage = String(Number(this.pdfCurrentPage) - 1);
    };
    EmployeesComponent.prototype.setStartPage = function () {
        this.pdfStartPage = Number(this.pdfCurrentPage);
        if (this.pdfStartPage > this.pdfEndPage) {
            this.pdfEndPage = this.pdfStartPage;
        }
    };
    EmployeesComponent.prototype.setEndPage = function () {
        this.pdfEndPage = Number(this.pdfCurrentPage);
        if (this.pdfEndPage < this.pdfStartPage) {
            this.pdfStartPage = this.pdfEndPage;
        }
    };
    EmployeesComponent.prototype.emailConfirm = function () {
        this.employeesService.email(this.modalEmails, this.emailContents).subscribe(function (data) {
        });
    };
    EmployeesComponent.prototype.emailGroup = function (text) {
        this.modalEmails = this.employees.map(function (employee) { return employee.EMAIL; }).reduce(function (total, next) {
            return total + ", " + next;
        });
    };
    EmployeesComponent.prototype.emailGroupIncomplete = function (text) {
        this.modalEmails = this.employees.map(function (employee) { return employee.IS_COMPLETE.data[0] === 0 ? employee.EMAIL : ''; }).reduce(function (total, next) {
            return next !== '' ? total + ", " + next : total;
        });
    };
    EmployeesComponent.prototype.emailGroupLate = function (text) {
        console.log(text);
        console.log(this.emailContents);
    };
    EmployeesComponent.prototype.groupSelect = function (group) {
        var _this = this;
        this.sortAscending = true;
        this.sortDescending = true;
        if (this.selectedGroup !== undefined && this.selectedGroup !== null) {
            if (group.ID == this.selectedGroup.ID) {
                return;
            }
        }
        this.selectedGroup = group;
        this.transformResponseAndPopulate();
        this.employeesService.getAssignments(group.ID).subscribe(function (data2) {
            if (!data2['err']) {
                if (typeof (data2[0]) === undefined) {
                    _this.assignments = [];
                    _this.selectedAssignment = null;
                    _this.employees = [];
                }
                else {
                    _this.assignments = data2;
                    _this.selectedAssignment = data2[0];
                    _this.editAssignmentValues = { 'START_DATE': _this.selectedAssignment.START_DATE, 'DUE_DATE': _this.selectedAssignment.DUE_DATE, 'MINUTES': _this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS': _this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES': _this.selectedAssignment.NOTES };
                    _this.countdown = new Date(1970, 0, 1).setSeconds(_this.selectedAssignment.TIME_TO_COMPLETE);
                    _this.employeesService.getEmployees(_this.selectedGroup.ID, _this.selectedAssignment.assignment_id).subscribe(function (data3) {
                        _this.employees = data3;
                        var complete = 0;
                        var total = data3.length;
                        for (var i = 0; i < data3.length; i++) {
                            console.log(data3[i]);
                            if (data3[i].IS_COMPLETE !== null) {
                                if (data3[i].IS_COMPLETE.data[0] === 1) {
                                    complete = complete + 1;
                                }
                            }
                        }
                        if (complete === 0) {
                            _this.selectedAssignmentCompletion = 0 + "%";
                        }
                        else {
                            _this.selectedAssignmentCompletion = Math.floor((complete / total) * 100) + "%";
                        }
                    });
                }
            }
            else {
                _this.assignments = [{
                        "assignment_id": -1,
                        "NAME": "No assignments",
                        "NOTES": "",
                        "START_DATE": null,
                        "DUE_DATE": null,
                        "book_id": -1,
                        "lesson_id": -1,
                        "TIME_TO_COMPLETE": 0
                    }];
                _this.selectedAssignment = _this.assignments[0];
                _this.editAssignmentValues = { 'START_DATE': _this.selectedAssignment.START_DATE, 'DUE_DATE': _this.selectedAssignment.DUE_DATE, 'MINUTES': _this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS': _this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES': _this.selectedAssignment.NOTES };
                _this.countdown = new Date(1970, 0, 1).setSeconds(_this.selectedAssignment.TIME_TO_COMPLETE);
                _this.employeesService.getEmployees(group.ID, -1).subscribe(function (data3) {
                    _this.employees = data3;
                    var complete = 0;
                    var total = data3.length;
                    for (var i = 0; i < data3.length; i++) {
                        if (data3[i].IS_COMPLETE !== null) {
                            if (data3[i].IS_COMPLETE.data[0] === 1) {
                                complete = complete + 1;
                            }
                        }
                    }
                    if (complete === 0) {
                        _this.selectedAssignmentCompletion = 0 + "%";
                    }
                    else {
                        _this.selectedAssignmentCompletion = Math.floor((complete / total) * 100) + "%";
                    }
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
    };
    EmployeesComponent.prototype.addAssignment = function () {
        console.log("Add assignment works");
    };
    EmployeesComponent.prototype.addGroup = function () {
        console.log("Add group works");
    };
    EmployeesComponent.prototype.viewSwitch = function (selected) {
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
            }
            else {
                this.viewAssignments = true;
                assignmentButton.id = 'assignmentButtonActive';
                document.getElementById('secondColumn').className = 'col-xl-2';
                document.getElementById('thirdColumn').className = 'col-xl-8';
            }
        }
        else if (selected === "lessons") {
            this.viewAssignments = false;
            assignmentButton.id = 'assignmentButton';
            if (this.viewLessons) {
                this.viewLessons = false;
                lessonButton.id = 'lessonButton';
                document.getElementById('secondColumn').className = 'col-xl-0';
                document.getElementById('thirdColumn').className = 'col-xl-10';
            }
            else {
                this.viewLessons = true;
                lessonButton.id = 'lessonButtonActive';
                document.getElementById('secondColumn').className = 'col-xl-6';
                document.getElementById('thirdColumn').className = 'col-xl-4';
            }
        }
        this.viewPdf = false;
        document.getElementById('fourthColumn').className = 'col-xl-0';
        document.getElementById('fourthColumn').style.display = 'none';
    };
    EmployeesComponent.prototype.assignmentSelect = function (assignment, index) {
        var _this = this;
        console.log(assignment);
        this.countdown = new Date(1970, 0, 1).setSeconds(assignment.TIME_TO_COMPLETE);
        var assignments = document.getElementsByClassName('assignment-summary');
        for (var i = 0; i < assignments.length; i++) {
            if (index == i) {
                assignments[i].className = 'assignment-summary assignment-summary-selected';
            }
            else {
                assignments[i].className = 'assignment-summary';
            }
        }
        this.selectedAssignment = assignment;
        this.editAssignmentValues = { 'START_DATE': this.selectedAssignment.START_DATE, 'DUE_DATE': this.selectedAssignment.DUE_DATE, 'MINUTES': this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS': this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES': this.selectedAssignment.NOTES };
        this.countdown = new Date(1970, 0, 1).setSeconds(this.selectedAssignment.TIME_TO_COMPLETE);
        this.employeesService.getEmployees(this.selectedGroup.ID, assignment.assignment_id).subscribe(function (data3) {
            _this.employees = data3;
            var complete = 0;
            var total = data3.length;
            for (var i = 0; i < data3.length; i++) {
                if (data3[i].IS_COMPLETE !== null) {
                    if (data3[i].IS_COMPLETE.data[0] === 1) {
                        complete = complete + 1;
                    }
                }
            }
            if (complete === 0) {
                _this.selectedAssignmentCompletion = 0 + "%";
            }
            else {
                _this.selectedAssignmentCompletion = Math.floor((complete / total) * 100) + "%";
            }
        });
        this.loadAssignmentPreview();
    };
    EmployeesComponent.prototype.editAssignment = function () {
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
        this.editAssignmentValues = { 'START_DATE': this.selectedAssignment.START_DATE, 'DUE_DATE': this.selectedAssignment.DUE_DATE, 'MINUTES': this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS': this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES': this.selectedAssignment.NOTES };
        console.log(this.editAssignmentValues);
    };
    EmployeesComponent.prototype.updateAssignment = function () {
        var _this = this;
        var minute = parseInt(document.getElementById("minutesEdit").value);
        var seconds = "0";
        var secondsInt = 0;
        if (document.getElementById("secondsEdit").value !== null && document.getElementById("secondsEdit").value !== undefined) {
            secondsInt = parseInt(document.getElementById("secondsEdit").value);
        }
        var time_to_complete = (minute * 60) + secondsInt;
        var notes = document.getElementById("notesInputEdit").value;
        var start_date = new Date(document.getElementById('startDateEdit').value);
        var due_date = new Date(document.getElementById('dueDateEdit').value);
        console.log(start_date);
        start_date.setDate(start_date.getDate() + 1);
        due_date.setDate(due_date.getDate() + 1);
        console.log(start_date.toString());
        var dataForm = {
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
        var startDate = new Date(start_date);
        var dueDate = new Date(due_date);
        var assign = {
            NAME: this.selectedAssignment.NAME,
            lesson_id: this.selectedAssignment.lesson_id,
            book_id: this.selectedAssignment.book_id,
            DUE_DATE: dueDate,
            START_DATE: startDate,
            TIME_TO_COMPLETE: time_to_complete,
            assignment_id: this.selectedAssignment.assignment_id,
            NOTES: notes
        };
        if (notes !== null && notes !== undefined && notes != "") {
            assign.NOTES = notes;
        }
        console.log(assign);
        console.log(dataForm);
        for (var i = 0; i < this.assignments.length; i++) {
            if (this.assignments[i].assignment_id == assign.assignment_id) {
                this.assignments[i] = assign;
            }
        }
        this.selectedAssignment = assign;
        this.editAssignmentValues = { 'START_DATE': this.selectedAssignment.START_DATE, 'DUE_DATE': this.selectedAssignment.DUE_DATE, 'MINUTES': this.selectedAssignment.TIME_TO_COMPLETE / 60, 'SECONDS': this.selectedAssignment.TIME_TO_COMPLETE % 60, 'NOTES': this.selectedAssignment.NOTES };
        this.bookService.editAssignment(this.selectedAssignment.assignment_id, dataForm).subscribe(function (res) {
            console.log('complete');
            _this.employeesService.getEmployees(_this.selectedGroup.ID, _this.selectedAssignment.assignment_id).subscribe(function (data3) {
                _this.employees = data3;
                var complete = 0;
                var total = data3.length;
                for (var i = 0; i < data3.length; i++) {
                    //console.log(data3[i]);
                    if (data3[i].IS_COMPLETE !== null) {
                        if (data3[i].IS_COMPLETE.data[0] === 1) {
                            complete = complete + 1;
                        }
                    }
                }
                _this.selectedAssignment.percent_complete = complete / total;
            });
        });
    };
    EmployeesComponent.prototype.lessonSelect = function (lesson) {
        this.dataObj.selectedLesson = lesson;
    };
    EmployeesComponent.prototype.toggle = function (lesson) {
        console.log('toggle start');
        lesson.toggle();
        var show = false;
        for (var i = 0; i < this.dataObj.selectedBook.LESSONS.length; i++) {
            if (this.dataObj.selectedBook.LESSONS[i].is_checked) {
                show = true;
            }
        }
        if (show) {
            document.getElementById('deleteLessonButton').className = 'btn btn-primary show';
        }
        else {
            document.getElementById('deleteLessonButton').className = 'btn btn-primary';
        }
        console.log('toggle end');
    };
    EmployeesComponent.prototype.toggleSort = function () {
        console.log('toggling sorting direction');
        console.log(this.sortAscending);
        console.log(this.sortDescending);
        console.log(this.assignments);
        var sortDesc = function compare(a, b) {
            if (a.DUE_DATE < b.DUE_DATE) {
                return -1;
            }
            if (a.DUE_DATE > b.DUE_DATE) {
                return 1;
            }
            // a must be equal to b
            return 0;
        };
        var sortAsc = function compare(a, b) {
            if (a.DUE_DATE > b.DUE_DATE) {
                return -1;
            }
            if (a.DUE_DATE < b.DUE_DATE) {
                return 1;
            }
            // a must be equal to b
            return 0;
        };
        if (this.sortDescending) {
            this.assignments.sort(sortAsc);
            this.sortAscending = true;
            this.sortDescending = false;
        }
        else {
            this.assignments.sort(sortDesc);
            this.sortAscending = false;
            this.sortDescending = true;
        }
    };
    EmployeesComponent.prototype.deleteLessons = function () {
        var saved = [];
        for (var i = 0; i < this.dataObj.selectedBook.LESSONS.length; i++) {
            if (!this.dataObj.selectedBook.LESSONS[i].is_checked) {
                saved.push(this.dataObj.selectedBook.LESSONS[i]);
            }
        }
        this.dataObj.selectedBook.LESSONS = saved;
        this.saveDeleteLesosns();
    };
    EmployeesComponent.prototype.signInWithEmail = function () {
        var _this = this;
        console.log(1);
        this.authService.signInRegular(this.userEmail, this.userPassword)
            .then(function (res) {
            _this.employeesService.getUserByEmail(_this.userEmail).subscribe(function (res2) {
                if (res2[0] == undefined) {
                    _this.loginErrorMessage = "You are not in the website database. If you received an email invitation, but get this error, something went wrong. Please contact an administrator";
                    _this.isLoginError = true;
                    //this.isLoggedIn = true;
                    console.log(2);
                }
                else {
                    console.log(3);
                    _this.firstName = res2[0]['FIRST_NAME'];
                    _this.lastName = res2[0]['LAST_NAME'];
                    if (res2[0]['FIRST_NAME'] == '' || res2[0]['FIRST_NAME'] == null || res2[0]['FIRST_NAME'] == undefined) {
                        _this.isLoginError = false;
                        _this.newUser = true;
                        console.log(4);
                    }
                    else {
                        console.log(5);
                        if (res2[0]['IS_ADMIN']['data'][0] == 1) {
                            _this.admin_id = 3; //Hardcode since groups shouldnt care about admin ids
                            _this.onAdminLogin(_this.admin_id); //HARDCODE FOR TESTING
                            //this.onAdminLogin(this.admin_id);
                            _this.isLoggedIn = true;
                            console.log(6);
                        }
                        else {
                            //console.log(res2[0]['IS_ADMIN']);
                            //console.log(this.admin_id);
                            //Employee Login logic occurs
                            _this.admin_id = 0;
                            _this.isLoggedIn = true;
                            _this.newUser = false;
                            console.log(7);
                        }
                    }
                }
            }, function (err2) {
                _this.loginErrorMessage = err2;
                _this.isLoginError = true;
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
                    this.onAdminLogin(3);
                    this.isLoggedIn = true;
                }
            },
            (err) => {
                this.loginErrorMessage = "Internal server error, please contact an admin: " + err;
                this.isLoginError = true;
            })
            //*/
        })
            .catch(function (err) {
            _this.loginErrorMessage = err;
            _this.isLoginError = true;
        });
    };
    EmployeesComponent.prototype.getApk = function () {
        this.employeesService.getApk().subscribe(function (data) { return Object(__WEBPACK_IMPORTED_MODULE_8_file_saver__["saveAs"])(data, "SafetyTraining.apk"); }, function (error) { return console.log(error); });
    };
    EmployeesComponent.prototype.signInFirstTime = function () {
        var _this = this;
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
        else if (this.newUserPhoneNumber.length != 10) {
            this.loginErrorMessage = "Please enter a valid phone number (at least 10 numbers)";
            this.isLoginError = true;
        }
        else {
            this.authService.updateUserNames(this.newUserFirstName, this.newUserLastName, this.newPassword, this.newUserPhoneNumber).then(function (ret) {
                _this.newUserObject = ret;
                console.log({ "newUser": _this.newUserObject });
                _this.newUserError = _this.newUserObject['error'];
                console.log({ "Error": _this.newUserError });
                console.log({ "affectedRows": _this.newUserObject['affectedRows'] });
                if (_this.newUserObject['affectedRows'] != 1) {
                    _this.loginErrorMessage = "Internal server error. Please contact an administrator";
                    console.log(_this.newUserError);
                    _this.isLoginError = true;
                }
                else {
                    _this.loginErrorMessage = "Success!";
                    console.log(_this.loginErrorMessage);
                    _this.isLoginError = true;
                    _this.userPassword = _this.newPassword;
                    _this.signInWithEmail();
                }
                console.log(_this.loginErrorMessage);
            }, function (err) {
                console.log(err);
            });
        }
    };
    EmployeesComponent.prototype.resetPassword = function () {
        var _this = this;
        this.authService.resetPassword(this.userEmail)
            .subscribe(function (res) {
            _this.loginErrorMessage = 'Password has been reset. Check your email!';
            _this.isLoginError = true;
        }, function (err) {
            _this.loginErrorMessage = 'Could not send password reset. Ensure email address is correct.';
            _this.isLoginError = true;
        });
    };
    EmployeesComponent.prototype.changePassword = function () {
    };
    EmployeesComponent.prototype.logout = function () {
        this.userEmail = "";
        this.userPassword = "";
        this.authService.logout();
        this.loginErrorMessage = "";
        this.isLoginError = false;
        this.isLoggedIn = false;
    };
    EmployeesComponent.prototype.ngOnInit = function () {
        this.selectedGroup = this.groups[0];
    };
    EmployeesComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'app-employees',
            template: __webpack_require__("../../../../../src/app/employees/employees.component.html"),
            styles: [__webpack_require__("../../../../../src/app/employees/employees.component.css")],
            providers: [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__employees_service__["a" /* EmployeesService */],
            __WEBPACK_IMPORTED_MODULE_6_ngx_toastr__["b" /* ToastrService */],
            __WEBPACK_IMPORTED_MODULE_7__auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_5__book_service__["a" /* BookService */], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormBuilder */]])
    ], EmployeesComponent);
    return EmployeesComponent;
}());



/***/ }),

/***/ "../../../../../src/app/lesson.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Lesson; });
var Lesson = /** @class */ (function () {
    function Lesson(id, name, book_id, start, end, PDF_FILE, groupIds) {
        this.START_PAGE = 0;
        this.END_PAGE = 0;
        this.PDF_FILE = '';
        this.is_checked = false;
        this.is_assigned = false;
        this.changed_state = false;
        this.is_valid = false;
        this.ASSIGNMENT_GROUPS = [];
        this.ID = id;
        this.NAME = name;
        this.BOOK_ID = book_id;
        this.PDF_FILE = PDF_FILE;
        this.START_PAGE = start;
        this.END_PAGE = end;
        this.ASSIGNMENTS_GROUP_IDS = groupIds ? groupIds : '';
        if (groupIds) {
            this.ASSIGNMENT_GROUPS = this.groupIdStringToNumber(groupIds);
        }
        this.is_valid = this.validationCheck();
    }
    Lesson.prototype.groupIdStringToNumber = function (groupIds) {
        var groupIdList = groupIds.split(',');
        if (groupIdList.length > 0) {
            groupIdList = groupIdList.map(function (item) {
                return Number(item);
            });
            return groupIdList;
        }
        return [];
    };
    Lesson.prototype.toggle = function () {
        this.is_checked = !this.is_checked;
    };
    Lesson.prototype.changed = function () {
        this.changed_state = true;
    };
    Lesson.prototype.setIsAssigned = function (status) {
        if (this.is_assigned != status) {
            this.is_assigned = status;
        }
    };
    Lesson.prototype.isAssignedByGroupId = function (groupId) {
        var s = this.ASSIGNMENT_GROUPS.length > 0 && this.ASSIGNMENT_GROUPS.indexOf(groupId) > -1;
        this.setIsAssigned(s);
        return s;
    };
    Lesson.prototype.validationCheck = function (total_pages) {
        if (total_pages === void 0) { total_pages = 0; }
        return this.is_valid = this.NAME != '' && this.END_PAGE && this.START_PAGE &&
            (this.START_PAGE <= this.END_PAGE) && (this.END_PAGE <= total_pages && this.START_PAGE <= total_pages);
    };
    Lesson.prototype.setGroup = function (groupId) {
        this.setIsAssigned(true);
        if (this.ASSIGNMENTS_GROUP_IDS) {
            this.ASSIGNMENTS_GROUP_IDS = this.ASSIGNMENT_GROUPS.join(',');
        }
        this.ASSIGNMENT_GROUPS.push(groupId);
    };
    Lesson.prototype.removeAssingGroup = function (group_id) {
        var index = this.ASSIGNMENT_GROUPS.indexOf(group_id);
        console.log('index', index);
        if (this.ASSIGNMENT_GROUPS.hasOwnProperty(index)) {
            this.ASSIGNMENT_GROUPS.splice(index, 1);
            this.ASSIGNMENTS_GROUP_IDS = this.ASSIGNMENT_GROUPS.join(',');
            console.log('this.ASSIGNMENTS_GROUP_IDS', this.ASSIGNMENTS_GROUP_IDS);
        }
        //
        // this.ASSIGNMENT_GROUPS = [];
        // this.ASSIGNMENTS_GROUP_IDS = '';
    };
    return Lesson;
}());



/***/ }),

/***/ "../../../../../src/app/pending.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PendingPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var PendingPipe = /** @class */ (function () {
    function PendingPipe() {
    }
    PendingPipe.prototype.transform = function (value) {
        if (value === undefined || value === null || value == "") {
            return "[Pending]";
        }
        else {
            return value;
        }
    };
    PendingPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["S" /* Pipe */])({
            name: 'pending'
        })
    ], PendingPipe);
    return PendingPipe;
}());



/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
var environment = {
    production: true,
    firebase: {
        apiKey: "AIzaSyDj3uGXUayslSgPJnwmpqHjwQ_c0ZCqBv4",
        authDomain: "safety-book-reader.firebaseapp.com",
        databaseURL: "https://safety-book-reader.firebaseio.com",
        projectId: "safety-book-reader",
        storageBucket: "safety-book-reader.appspot.com",
        messagingSenderId: "219029116689"
    },
    restURL: "https://safetytraining.libertyelevator.com:3000"
};


/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/esm5/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/esm5/platform-browser-dynamic.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map