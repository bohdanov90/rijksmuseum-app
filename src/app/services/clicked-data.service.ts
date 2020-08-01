import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClickedDataService {
  public clickedObjectData$: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor() { }

  setValues(data: any): void {
    this.clickedObjectData$.next(data);
  }

  getValues$(): Observable<any> {
    return this.clickedObjectData$.asObservable();
  }
}
