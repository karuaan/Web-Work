import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Employee } from './employee';
import { Assignment } from './assignment';
import { Group } from './group';
import { MasterEntry } from './master-entry';
import { Observable } from 'rxjs';

@Injectable()
export class EmployeesService {

	restURL: string;

  constructor(private http: HttpClient) { 
	  var debug = true;
	  if(!debug){
		this.restURL =  'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000';
	  }
	  else{
		this.restURL = 'http://localhost:3000';
	  }
  }
  
  convertToEmployeeArray(){
	  
  }
  
  email(user_emails){
  
  }
  
  getMasterTable(admin_id): Observable<MasterEntry[]>{
	  var response = this.http.post<MasterEntry[]>(this.restURL + '/getMasterTable', {'admin_id': admin_id});
	  return response;
  }
  
  getBooks(): Observable<Book[]>{
	  var response = this.http.get<Book[]>(this.restURL + '/books');
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
  
}
