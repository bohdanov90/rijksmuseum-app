import { Component, ViewChild, AfterViewInit, OnDestroy, ViewEncapsulation, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { NetworkQueries } from '../../enums/network-queries.enum';
import { takeUntil, switchMap, tap } from 'rxjs/operators';
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
export class MainContentComponent implements OnInit, AfterViewInit, OnDestroy {
  public headerImage = NetworkQueries.HEADER_IMAGE;
  public url = NetworkQueries.URL;
  public artObjects = NetworkQueries.ART_OBJECTS;
  public count = NetworkQueries.COUNT;

  public displayData: boolean;
  public clickedArtObject: ArtObject;
  public detailsObject: DetailedData;
  public formValues;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSizeOptions = [10, 20, 50, 100];
  public query: Data;
  public initialNumOfPages = 0;
  public initialResPerPage = 10;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private networkService: NetworkService,
    private formValuesService: FormValuesService,
    private matDialog: MatDialog,
    private clickedDataService: ClickedDataService,
    private navigationService: NavigationService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.navigateInitial();
    this.formValuesService.getValues$()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(formValues => this.formValues = formValues);
  }

  ngAfterViewInit(): void {
    this.getQueryDataBasedOnFormData().subscribe(query => {
      this.paginator.pageIndex = 0;
      this.query = query;
      this.toggleDataDisplay();
    });

    this.detectPaginatorClick().subscribe(query => {
      this.navigateMainPageBasedOnFormData();
      this.query = query;
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public getQueryDataBasedOnFormData(): Observable<any> {
    return this.formValuesService.getValues$().pipe(
      switchMap(response => {
        if (!response) {
          return this.networkService.getQuery(
            '',
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            NetworkQueries.RELEVANCE
          );
        } else {
          return this.networkService.getQuery(
            response[NetworkQueries.SEARCH],
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            response[NetworkQueries.SORT],
          );
        }
      }),
      takeUntil(this.onDestroy$),
    );
  }

  public getDetailedQueryData(event): void {
    this.query.artObjects.map(clickedObject => {
      if (event.target.currentSrc === clickedObject.headerImage.url) {
        this.clickedArtObject = clickedObject;
      } else if (clickedObject.hasImage === false) {
        this.clickedArtObject = clickedObject;
      }
    });

    this.networkService.getDetailedQuery(this.clickedArtObject.objectNumber).pipe(
      tap(detailsObject => {
        this.detailsObject = detailsObject;
        this.openPopup();
        this.clickedDataService.setValues(detailsObject);
      }),
      takeUntil(this.onDestroy$),
    ).subscribe();
  }

  public navigateInitial(): void {
    this.navigationService.navigateMain(
      '', this.dataService.initialNumOfPages, this.dataService.initialResPerPage, NetworkQueries.RELEVANCE
    );
  }

  public navigateMainPageBasedOnFormData(): void {
    if (!!this.formValues) {
      this.navigationService.navigateMain(
        this.formValues[NetworkQueries.SEARCH],
        this.paginator.pageIndex + 1,
        this.paginator.pageSize,
        this.formValues[NetworkQueries.SORT],
      );
    } else {
      this.navigationService.navigateMain(
        '',
        this.paginator.pageIndex + 1,
        this.paginator.pageSize,
        NetworkQueries.RELEVANCE
      );
    }
  }

  public detectPaginatorClick() {
    return this.paginator.page.pipe(
      switchMap(() => this.getQueryDataBasedOnFormData()),
      takeUntil(this.onDestroy$),
    );
  }

  public toggleDataDisplay(): void {
    if (this.query !== undefined && this.query !== null) {
      this.query.count === 0 ? this.displayData = false : this.displayData = true;
    }
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
