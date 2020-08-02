import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormValuesService {
  private formValues$: BehaviorSubject<string> = new BehaviorSubject(null);

  setValues(data): void {
    this.formValues$.next(data);
  }

  getValues$(): Observable<any> {
    return this.formValues$.asObservable();
  }
}
