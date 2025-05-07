import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
private apiUrl = 'api/people';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updatePerson(person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${person.id}`, person, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deletePerson(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      msg = `Client-side: ${error.error.message}`;
    } else {
      msg = `Server-side: ${error.status} ${error.message}`;
    }
    console.error(msg);
    return throwError(msg);
  }
}
