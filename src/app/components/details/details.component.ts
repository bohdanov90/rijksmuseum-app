import { Component, OnInit } from '@angular/core';
import { ClickedDataService } from '../../services/clicked-data.service';
import { Observable } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';
import { DataService } from '../../services/data.service';
import { DetailedData } from '../../interfaces/detailed-data.interface';
import { NetworkQueries } from 'src/app/enums/network-queries.enum';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public detailedData$: Observable<DetailedData>;

  constructor(
    private clickedDataService: ClickedDataService,
    private navigationService: NavigationService,
    private dataService: DataService,
    ) {}

  ngOnInit(): void {
    this.detailedData$ = this.clickedDataService.getValues$();
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
