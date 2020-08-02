import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public apiKey = 'Hms9T9oA';

  constructor(
    private http: HttpClient,
  ) {}

  public getQuery(query: string, numOfPages: number, resPerPage: number, sort: string): Observable<object> {
    return this.http.get(
      `https://www.rijksmuseum.nl/api/en/collection`, {
        params: new HttpParams()
          .set('key', this.apiKey)
          .set('q', query)
          .set('p', numOfPages.toString())
          .set('ps', resPerPage.toString())
          .set('s', sort)
      }
    ).pipe(
      catchError((err: Error) => {
        console.log('An error occurred:', err.message);
        return of([]);
      }),
    );
  }

  public getDetailedQuery(objectNumber: string): Observable<any> {
    return this.http.get(
      `https://www.rijksmuseum.nl/api/en/collection/${objectNumber}`, {
        params: new HttpParams()
          .set('key', this.apiKey)
      }
    ).pipe(
      catchError((err: Error) => {
        console.log('An error occurred:', err.message);
        return of([]);
      }),
    );
  }
}
