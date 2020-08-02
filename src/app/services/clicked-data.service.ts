import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClickedDataService {
  private clickedObjectData$: BehaviorSubject<string> = new BehaviorSubject(null);

  public setValues(data): void {
    this.clickedObjectData$.next(data);
  }

  public getValues$(): Observable<any> {
    return this.clickedObjectData$.asObservable();
  }
}
