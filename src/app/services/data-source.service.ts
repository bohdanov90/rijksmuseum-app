import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of } from 'rxjs';
import { NetworkService } from './network.service';
import { catchError, tap } from 'rxjs/operators';
import { CollectionViewer } from '@angular/cdk/collections';
import { FormValuesService } from './form-values.service';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService extends DataSource<any> {
  public initialNumOfPages = 0;
  public initialResPerPage = 10;

  private dataSubject$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    public networkService: NetworkService,
    public formValuesService: FormValuesService,
  ) {
    super();
  }

  connect() {
    return this.dataSubject$.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer) {
    this.dataSubject$.complete();
  }

  loadData(
    query = '',
    numOfPages = this.initialNumOfPages,
    resPerPage = this.initialResPerPage,
    sort = this.formValuesService.sortValues[0].apiName
  ) {
    return this.networkService.getQuery(query, numOfPages, resPerPage, sort).pipe(
      catchError(() => of([])),
      tap(data => {
        // console.log(data);
        return this.dataSubject$.next(data);
      }),
    );
  }
}
