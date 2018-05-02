import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import {API_CONFIG, DEBUG_MODE} from './config/index';
import { environment } from '../environments/environment';
import {Book} from './book';
import { Observable } from 'rxjs/Observable';
import {Lesson} from './lesson';

@Injectable()
export class BookService {

    _api: any;
	restURL: string;

  constructor(private http: HttpClient) {
    this.setConfig();
	this.restURL = environment.restURL;
  }

  getBooks(): Observable<Book[]> {
      return this.http.get<Book[]>(this._api.endpoint + '/books');
  }

  saveBooks(data): Observable<any> {
      return this.http.post<any>(this.restURL + '/new/book', data);
  }

  saveAssignment(lessionId, data): Observable<Book[]> {
    return this.http.post<any>(`${this.restURL}/lessons/${lessionId}/assignment`, data);
  }

  getStatuses(): Observable<any[]> {
    return this.http.get<any>(`${this.restURL}/getstatuses`);
  }

  saveEmployee(group_id, data): Observable<Book[]> {
    return this.http.post<any>(`${this.restURL}/groups/${group_id}/employees`, data);
  }

  removeAssignmentFromGroup(data) {
      return this.http.post<any>(`${this.restURL}/lessons/remove-assignment`, data);
  }

  saveGroup(data): Observable<Book[]> {
    return this.http.post<any>(`${this.restURL}/groups/save`, data);
  }

  batchSaveLesson(data): Observable<any[]> {
    return this.http.post<any>(this.restURL + '/batch-save/lessons', data);
  }

  batchUpdateLesson(data): Observable<any[]> {
    return this.http.post<any>(this.restURL + '/batch-update/lessons', data);
  }


  saveLessons(data): Observable<Book[]> {
    return this.http.post<any>(this.restURL + '/new/lesson', data);
  }

  getLessons(): Observable<Lesson[]> {
      return this.http.get<Lesson[]>(this.restURL + '/getlessons');
  }

  getBookLessons(bookId): Observable<Lesson[]> {
      return this.http.get<Lesson[]>(`${this.restURL}/books/${bookId}/lessons`);
  }

/*   setConfig(): void {
      if (DEBUG_MODE) {
           this._api = API_CONFIG.development;
      } else {
           this._api = API_CONFIG.production;
      }
  }

  getConfig(): any {
      return this._api;
  } */

}
