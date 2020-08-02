import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClickedDataService } from '../../services/clicked-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import { NetworkQueries } from '../../enums/network-queries.enum';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  public details;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private clickedDataService: ClickedDataService,
    private navigationService: NavigationService,
    private dataService: DataService,
    ) {}

  ngOnInit(): void {
    this.clickedDataService.getValues$().pipe(takeUntil(this.onDestroy$)).subscribe(details => this.details = details);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public backToMain() {
    this.navigationService.navigateMain(
      '',
      this.dataService.initialNumOfPages,
      this.dataService.initialResPerPage,
      NetworkQueries.RELEVANCE,
    );
  }
}
