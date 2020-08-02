import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { NetworkQueries } from '../../enums/network-queries.enum';
import { tap, takeUntil, mergeMap, take } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { FormValuesService } from '../../services/form-values.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ClickedDataService } from '../../services/clicked-data.service';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { DataService } from '../../services/data.service';

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
  public search = NetworkQueries.SEARCH;
  public sort = NetworkQueries.SORT;

  public displayData: boolean;
  public clickedArtObject;
  public detailsObject;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSizeOptions = [10, 20, 50, 100];
  public query: any;
  public initialNumOfPages = this.dataService.initialNumOfPages;
  public initialResPerPage = this.dataService.initialResPerPage;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    public networkService: NetworkService,
    public formValuesService: FormValuesService,
    public matDialog: MatDialog,
    private clickedDataService: ClickedDataService,
    private navigationService: NavigationService,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.paginator.pageIndex = 1;

    this.paginator.page.pipe(
      tap(() => this.loadDataPage()),
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

  public loadDataPage() {
    return this.getFormData().pipe(
      take(1),
      takeUntil(this.onDestroy$),
    ).subscribe(query => this.query = query);
  }

  public navigateMainPage() {
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
            response[this.search],
            this.paginator.pageIndex,
            this.paginator.pageSize,
            response[this.sort],
          );
        }
      }),
      takeUntil(this.onDestroy$),
    );
  }

  public getFormData() {
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
            response[this.search],
            this.paginator.pageIndex,
            this.paginator.pageSize,
            response[this.sort],
          );
        }
      }),
    );
  }

  public toggleDataDisplay() {
    if (this.query !== undefined && this.query !== null) {
      this.query.count === 0 ? this.displayData = false : this.displayData = true;
    }
  }

  public getDetailedData(event) {
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

  public openPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.data = this.detailsObject;

    this.matDialog.open(PopupComponent, dialogConfig);
  }
}
