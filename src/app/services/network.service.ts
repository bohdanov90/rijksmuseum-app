import { NetworkQueries } from './../enums/network-queries.enum';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private apiKey = 'Hms9T9oA';
  private artObjects = NetworkQueries.ART_OBJECTS;
  private headerImage = NetworkQueries.HEADER_IMAGE;
  private url = NetworkQueries.URL;
  private longTitle = NetworkQueries.LONG_TITLE;
  private title = NetworkQueries.TITLE;

  constructor(private http: HttpClient) {}

  public getQuery(query: string, numOfPages: number, resPerPage: number): Observable<object> {
    return this.http.get(
      `https://www.rijksmuseum.nl/api/en/collection?key=${this.apiKey}&q=${query}&p=${numOfPages}&ps=${resPerPage}`
    );
  }

  public getAllArtObjects(query: string, numOfPages: number, resPerPage: number): Observable<object> {
    return this.getQuery(query, numOfPages, resPerPage).pipe(
      map(response => response[this.artObjects])
    );
  }
}
