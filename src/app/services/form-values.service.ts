import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormValuesService {
  public formValues$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor() {}

  setValues(data: any): void {
    this.formValues$.next(data);
  }

  getValues$(): Observable<any> {
    return this.formValues$.asObservable();
  }
}
