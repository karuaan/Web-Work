import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { Employee } from './employee';
import { Assignment } from './assignment';
import { Group } from './group';
import { Book } from './book';
import { Lesson } from './lesson';
import { MasterEntry } from './master-entry';

import { Observable } from 'rxjs';
//import {API_CONFIG, DEBUG_MODE} from './config/index';
import { environment } from '../environments/environment';

@Injectable()
export class EmployeeService {

	restURL: string;

	constructor(private http: HttpClient) {	  
	  this.restURL = environment.restURL;
	}

	getUserData(user_id){
	var response = this.http.get(this.restURL + '/user/${user_id}');
	return response;
	}

	email(user_emails, message){
	var response = this.http.post(this.restURL + '/emailToList', {'emailList': user_emails, 'text': message});
	return response;
	}

	getStatuses(): Observable<any[]> {
	return this.http.get<any>(`${this.restURL}/getstatuses`);
	}

	saveEmployee(group_id, data): Observable<Book[]> {
	return this.http.post<any>(`${this.restURL}/groups/${group_id}/employees`, data);
	}

	getEmployees(group_id, assignment_id): Observable<Employee[]>{
	  var response = this.http.post<Employee[]>(this.restURL + '/getemployeesstatus', {'group_id': group_id, 'assignment_id':assignment_id});
	  return response;
	}
	sendInvitationAdmin(data): any {
		var response = this.http.post(this.restURL + '/inviteAdmin', data);
		return response;
	}

	sendInvitationUser(data): any {
		var response = this.http.post(this.restURL + '/inviteUser', data);
		return response;
	}

	getAdminID(email): Observable<Object>{
		var response = this.http.post<Object>(this.restURL + '/getAdminID', {'email' : email});
		return response;
	}

	getUserByEmail(email): Observable<Object>{
		var response = this.http.post<Object>(this.restURL + '/getUserByEmail', {'email' : email});
		return response;
	}
}
