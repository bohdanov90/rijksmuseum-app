import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { Router } from '@angular/router';
import { Routing } from '../enums/routing.enum';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private networkService: NetworkService,
    private router: Router,
  ) {}

  public navigateMain(query, numOfPages, resPerPage, sort) {
    this.router.navigate([Routing.MAIN], { queryParams: {
      key: this.networkService.apiKey,
      q: query,
      p: numOfPages.toString(),
      ps: resPerPage.toString(),
      s: sort,
    }});
  }

  public navigateDetails(objectNumber) {
    this.router.navigate([`/api/en/collection/${objectNumber}`], { queryParams:
      { key: this.networkService.apiKey }
    });
  }
}
