import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of } from 'rxjs';
import { NetworkService } from './network.service';
import { catchError, tap } from 'rxjs/operators';
import { CollectionViewer } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService implements DataSource<any> {
  private dataSubject$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(public networkService: NetworkService) {}

  connect() {
    return this.dataSubject$.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.dataSubject$.complete();
  }

  loadData(query: string, numOfPages: number = 0, resPerPage: number = 10, sort: string = 'relevance') {
    return this.networkService.getQuery(query, numOfPages, resPerPage, sort).pipe(
      catchError(() => of([])),
      tap(data => {
        console.log(data);
        return this.dataSubject$.next(data);
      }),
    );
  }
}
