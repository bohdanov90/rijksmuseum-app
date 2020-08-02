import { Component, ViewChild, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { NetworkQueries } from '../../enums/network-queries.enum';
import { tap, takeUntil, mergeMap, take } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { FormValuesService } from '../../services/form-values.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ClickedDataService } from '../../services/clicked-data.service';
import { NavigationService } from '../../services/navigation.service';
import { DataService } from '../../services/data.service';
import { DetailedData } from '../../interfaces/detailed-data.interface';
import { ArtObject } from '../../interfaces/artObject.interface';
import { Data } from '../../interfaces/data.interface';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainContentComponent implements AfterViewInit, OnDestroy {
  public headerImage = NetworkQueries.HEADER_IMAGE;
  public url = NetworkQueries.URL;
  public artObjects = NetworkQueries.ART_OBJECTS;
  public count = NetworkQueries.COUNT;

  public displayData: boolean;
  public clickedArtObject: ArtObject;
  public detailsObject: DetailedData;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSizeOptions = [10, 20, 50, 100];
  public query: Data;
  public initialNumOfPages = this.dataService.initialNumOfPages;
  public initialResPerPage = this.dataService.initialResPerPage;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private networkService: NetworkService,
    private formValuesService: FormValuesService,
    private matDialog: MatDialog,
    private clickedDataService: ClickedDataService,
    private navigationService: NavigationService,
    private dataService: DataService,
  ) {}

  ngAfterViewInit(): void {
    this.paginator.page.pipe(
      tap(() => this.loadDataPage().subscribe(query => this.query = query)),
      tap(() => this.navigateMainPage().subscribe()),
      takeUntil(this.onDestroy$),
    ).subscribe();

    this.getFormData().pipe(
      takeUntil(this.onDestroy$),
    ).subscribe(query => {
      this.paginator.pageIndex = 0;
      this.query = query;
      this.toggleDataDisplay();
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public loadDataPage(): Observable<any> {
    return this.getFormData().pipe(
      take(1),
      takeUntil(this.onDestroy$),
    );
  }

  public navigateMainPage(): Observable<any> {
    return this.formValuesService.getValues$().pipe(
      tap(response => {
        if (!response) {
          this.navigationService.navigateMain(
            '',
            this.paginator.pageIndex,
            this.paginator.pageSize,
            NetworkQueries.RELEVANCE
          );
        } else {
          this.navigationService.navigateMain(
            response[NetworkQueries.SEARCH],
            this.paginator.pageIndex,
            this.paginator.pageSize,
            response[NetworkQueries.SORT],
          );
        }
      }),
      takeUntil(this.onDestroy$),
    );
  }

  public getFormData(): Observable<any> {
    return this.formValuesService.getValues$().pipe(
      mergeMap(response => {
        if (!response) {
          return this.networkService.getQuery(
            '',
            this.paginator.pageIndex,
            this.paginator.pageSize,
            NetworkQueries.RELEVANCE
          );
        } else {
          return this.networkService.getQuery(
            response[NetworkQueries.SEARCH],
            this.paginator.pageIndex,
            this.paginator.pageSize,
            response[NetworkQueries.SORT],
          );
        }
      }),
    );
  }

  public toggleDataDisplay(): void {
    if (this.query !== undefined && this.query !== null) {
      this.query.count === 0 ? this.displayData = false : this.displayData = true;
    }
  }

  public getDetailedData(event): void {
    this.query.artObjects.map(clickedObject => {
      if (event.target.currentSrc === clickedObject.headerImage.url) {
        this.clickedArtObject = clickedObject;
      }
    });

    this.networkService.getDetailedQuery(this.clickedArtObject.objectNumber).pipe(
      takeUntil(this.onDestroy$),
    ).subscribe(detailsObject => {
      this.detailsObject = detailsObject;
      this.openPopup();
      return this.clickedDataService.setValues(detailsObject);
    });
  }

  public openPopup(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.data = this.detailsObject;

    this.matDialog.open(PopupComponent, dialogConfig);
  }
}
