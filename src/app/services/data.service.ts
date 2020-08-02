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
    {
      displayName: 'Order by: Newest first',
      apiName: 'achronologic',
    },
    {
      displayName: 'Order by: Oldest first',
      apiName: 'chronologic',
    }
  ];
  public initialNumOfPages = 0;
  public initialResPerPage = 10;
}
