import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClickedDataService } from '../../services/clicked-data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import { DataService } from '../../services/data.service';
import { DetailedData } from '../../interfaces/detailed-data.interface';
import { NetworkQueries } from 'src/app/enums/network-queries.enum';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  public detailedData: DetailedData;
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private clickedDataService: ClickedDataService,
    private navigationService: NavigationService,
    private dataService: DataService,
    ) {}

  ngOnInit(): void {
    this.clickedDataService.getValues$()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((detailedData: DetailedData) => this.detailedData = detailedData);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public backToMain(): void {
    this.navigationService.navigateMain(
      '',
      this.dataService.initialNumOfPages,
      this.dataService.initialResPerPage,
      NetworkQueries.RELEVANCE,
    );
  }
}
