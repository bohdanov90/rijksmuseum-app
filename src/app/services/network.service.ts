import { NetworkQueries } from './../enums/network-queries.enum';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  private getQuery(query: string): Observable<object> {
    return this.http.get(`https://www.rijksmuseum.nl/api/en/collection?key=${this.apiKey}&q=${query}`);
  }

  private getAllArtObjects(query: string) {
    return this.getQuery(query).pipe(
      map(response => response[this.artObjects])
    );
  }

  public getHeaderImage(query: string): Observable<string> {
    return this.getAllArtObjects(query).pipe(
      map(artObjects => artObjects.map(el => el[this.headerImage][this.url]))
    );
  }

  public getTitle(query: string): Observable<string> {
    return this.getAllArtObjects(query).pipe(
      map(artObjects => artObjects.map(el => el[this.title]))
    );
  }
}
