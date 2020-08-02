import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public sortValues = [
    {
      displayName: 'Order by: Relevance',
      apiName: 'relevance',
    },
    {
      displayName: 'Order by: Type',
      apiName: 'objecttype',
    },
  ];
  public initialNumOfPages = 0;
  public initialResPerPage = 10;
}
