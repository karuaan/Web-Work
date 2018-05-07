import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
      //this.setConfig();
	  // var debug = false;
	  // if(!debug){
		// this.restURL =  'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000';
	  // }
	  // else{
		// this.restURL = 'http://localhost:3000';
	  // }
	  
	  this.restURL = environment.restURL;
  }
  
  convertToEmployeeArray(){
	  
  }

  getUserData(user_id){
	var response = this.http.get(this.restURL + '/user/${user_id}');
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
  
  getBooks(): Observable<any>{
	  var response = this.http.get<any>(this.restURL + '/books');
	  return response;
  }
  
  getLessons(): Observable<Lesson[]>{
	  var response = this.http.get<Lesson[]>(this.restURL + '/getlessons');
	  return response;
  }
  
  getEmployees(group_id, assignment_id): Observable<Employee[]>{
	  var response = this.http.post<Employee[]>(this.restURL + '/getemployeesstatus', {'group_id': group_id, 'assignment_id':assignment_id});
	  return response;
  }
  
  getAssignments(group_id): Observable<Assignment[]>{
	  var response = this.http.post<Assignment[]>(this.restURL + '/getassignments', {'group_id': group_id});
	  return response;
  }
  
  getGroups(admin_id): Observable<Group[]>{
	  var response = this.http.post<Group[]>(this.restURL + '/getgroups', {'admin_id': admin_id});
	  return response;
  }
/* 
  setConfig(): void {
       if (DEBUG_MODE) {
            this.restURL = API_CONFIG.development.endpoint;
       } else {
            this.restURL = API_CONFIG.production.endpoint;
       }
   } */

    sendInvitation(data): any {
        var response = this.http.post(this.restURL + '/inviteAdmin', data);
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
