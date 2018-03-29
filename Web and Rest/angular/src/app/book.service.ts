import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {API_CONFIG, DEBUG_MODE} from './config/index';
import {Book} from './book';
import { Observable } from 'rxjs/Observable';
import {Lesson} from './lesson';


@Injectable()
export class BookService {

    _api: any;

  constructor(private http: HttpClient) {
    this.setConfig();
  }

  getBooks(): Observable<Book[]> {
      return this.http.get<Book[]>(this._api.endpoint + '/books');
  }

  saveBooks(data): Observable<any> {
      return this.http.post<any>(this._api.endpoint + '/new/book', data);
  }

  saveAssignment(lessionId, data): Observable<Book[]> {
    return this.http.post<any>(`${this._api.endpoint}/lessons/${lessionId}/assignment`, data);
  }

  getStatuses(): Observable<any[]> {
    return this.http.get<any>(`${this._api.endpoint}/getstatuses`);
  }

  saveEmployee(group_id, data): Observable<Book[]> {
    return this.http.post<any>(`${this._api.endpoint}/groups/${group_id}/employees`, data);
  }

  saveGroup(data): Observable<Book[]> {
    return this.http.post<any>(`${this._api.endpoint}/groups/save`, data);
  }

  batchSaveLesson(data): Observable<any[]> {
    return this.http.post<any>(this._api.endpoint + '/batch-save/lessons', data);
  }

  batchUpdateLesson(data): Observable<any[]> {
    return this.http.post<any>(this._api.endpoint + '/batch-update/lessons', data);
  }


  saveLessons(data): Observable<Book[]> {
    return this.http.post<any>(this._api.endpoint + '/new/lesson', data);
  }

  getLessons(): Observable<Lesson[]> {
      return this.http.get<Lesson[]>(this._api.endpoint + '/getlessons');
  }

  getBookLessons(bookId): Observable<Lesson[]> {
      return this.http.get<Lesson[]>(`${this._api.endpoint}/books/${bookId}/lessons`);
  }

  setConfig(): void {
      if (DEBUG_MODE) {
           this._api = API_CONFIG.development;
      } else {
           this._api = API_CONFIG.production;
      }
  }

  getConfig(): any {
      return this._api;
  }

}
