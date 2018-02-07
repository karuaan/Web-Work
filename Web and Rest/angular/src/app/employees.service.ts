import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Employee } from './employee';
import { Assignment } from './assignment';
import { Group } from './group';
import { Observable } from 'rxjs';

@Injectable()
export class EmployeesService {

	restURL: string;

  constructor(private http: HttpClient) { 
	var restURL =  'http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000';
	//restURL = 'http://localhost:3000';
  }
  
  convertToEmployeeArray(){
	  
  }
  
  email(user_emails){
  
  }
  
  
  getEmployees(group_id, assignment_id): Observable<Employee[]>{
	  var response = this.http.post<Employee[]>('http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/getemployeesstatus', {'group_id': group_id, 'assignment_id':assignment_id});
	  return response;
  }
  
  getAssignments(group_id): Observable<Assignment[]>{
	  var response = this.http.post<Assignment[]>('http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/getassignments', {'group_id': group_id});
	  return response;
  }
  
  getGroups(admin_id): Observable<Group[]>{
	  var response = this.http.post<Group[]>('http://ec2-54-191-3-208.us-west-2.compute.amazonaws.com:3000/getgroups', {'admin_id': admin_id});
	  return response;
  }
  
}
