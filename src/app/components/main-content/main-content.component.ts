import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { NetworkQueries } from '../../enums/network-queries.enum';
import { tap, takeUntil, mergeMap, take } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { DataSourceService } from 'src/app/services/data-source.service';
import { FormValuesService } from '../../services/form-values.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ClickedDataService } from '../../services/clicked-data.service';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

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

  public sortValues = this.formValuesService.sortValues;
  public displayData: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: DataSourceService;
  public pageSizeOptions = [10, 20, 50, 100];
  public data: any;
  public initialNumOfPages = this.dataSourceService.initialNumOfPages;
  public initialResPerPage = this.dataSourceService.initialResPerPage;

  public clickedArtObject;
  public detailsObject;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    public networkService: NetworkService,
    public formValuesService: FormValuesService,
    public dataSourceService: DataSourceService,
    public matDialog: MatDialog,
    private clickedDataService: ClickedDataService,
    private router: Router,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.dataSource = new DataSourceService(this.networkService, this.formValuesService, this.router);
  }

  ngAfterViewInit(): void {
    // this.paginator.pageIndex = 1;

    this.paginator.page.pipe(
      tap(() => this.loadDataPage()),
      tap(() => this.navigateMainPage().subscribe()),
      takeUntil(this.onDestroy$),
    ).subscribe();

    this.getFormData().pipe(
      takeUntil(this.onDestroy$),
    ).subscribe(el => {
      this.paginator.pageIndex = 0;
      this.data = el;
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
    ).subscribe(el => this.data = el);
  }

  public navigateMainPage() {
    return this.formValuesService.getValues$().pipe(
      tap(response => {
        if (!response) {
          this.navigationService.navigateMain(
            '',
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.formValuesService.sortValues[0].apiName
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
    );
  }

  public getFormData() {
    return this.formValuesService.getValues$().pipe(
      mergeMap(response => {
        if (!response) {
          return this.dataSource.loadData(
            '',
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.formValuesService.sortValues[0].apiName
          );
        } else {
          return this.dataSource.loadData(
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
    if (this.data !== undefined && this.data !== null) {
      this.data.count === 0 ? this.displayData = false : this.displayData = true;
    }
  }

  public getDetailedData(event) {
    this.data.artObjects.map(el => {
      if (event.target.currentSrc === el.headerImage.url) {
        this.clickedArtObject = el;
      }
    });

    this.networkService.getDetailedQuery(this.clickedArtObject.objectNumber).pipe(
      takeUntil(this.onDestroy$),
    ).subscribe(el => {
      this.detailsObject = el;
      this.openDialog();
      return this.clickedDataService.setValues(el);
    });
  }

  public openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.data = this.detailsObject;

    this.matDialog.open(PopupComponent, dialogConfig);
  }
}
