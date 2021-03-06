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
export class EmployeesService {

	restURL: string;

  constructor(private http: HttpClient) {	  
	  this.restURL = environment.restURL;
  }
  
  convertToEmployeeArray(){
	  
  }
  
  removeEmployeeFromGroup(user_id, group_id): Observable<any>{
	  var response = this.http.post<any>(`${this.restURL}/removeUserFromGroup`, {'user_id': user_id, 'group_id': group_id});
	  return response;
  }
  
  deleteGroup(group_id): Observable <any>{
	  var response = this.http.post<any>(`${this.restURL}/deleteGroupById`, {'group_id': group_id});
	  return response;
  }

  getUserData(user_id){
	var response = this.http.get(`${this.restURL}/user/${user_id}`);
	return response;
  }
  
  email(user_emails, message){
	var response = this.http.post(this.restURL + '/emailToList', {'emailList': user_emails, 'text': message});
	return response;
  }
  
  getMasterTable(admin_id): Observable<MasterEntry[]>{
	  var response = this.http.post<MasterEntry[]>(this.restURL + '/getMasterTable', {'admin_id': admin_id});
	  return response;
  }
  
  getBooks(group_id){
	  var response = this.http.get<any>(`${this.restURL}/book/${group_id}`);
	  return response;
  }

  getApk() {
    var response = this.http.get(this.restURL + '/apk', {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
    return response;
  }
  
  getLessons(group_id): Observable<Lesson[]>{
	  var response = this.http.post<Lesson[]>(this.restURL + '/getlessons', {'group_id' : group_id});
	  return response;
  }
  
  getEmployees(group_id, assignment_id): Observable<Employee[]>{
	  var response = this.http.post<Employee[]>(this.restURL + '/getemployeesstatus', {'group_id': group_id, 'assignment_id':assignment_id});
	  return response;
  }
  
  getAssignments(group_id): Observable<Assignment[]>{
	  var response = this.http.post<Assignment[]>(this.restURL + '/getassignments2', {'group_id': group_id});
	  return response;
  }
  
  getGroups(admin_id): Observable<Group[]>{
	  var response = this.http.post<Group[]>(this.restURL + '/getgroups', {'admin_id': admin_id});
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
