import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormValuesService {
  public formValues$: BehaviorSubject<string> = new BehaviorSubject(null);
  public sortValues = [
    {
      displayName: 'Order by: Relevance',
      apiName: 'relevance',
    },
    {
      displayName: 'Order by: Type',
      apiName: 'objecttype',
    },
    {
      displayName: 'Order by: Newest first',
      apiName: 'achronologic',
    },
    {
      displayName: 'Order by: Oldest first',
      apiName: 'chronologic',
    }
  ];

  constructor() {}

  setValues(data: any): void {
    this.formValues$.next(data);
  }

  getValues$(): Observable<any> {
    return this.formValues$.asObservable();
  }
}
