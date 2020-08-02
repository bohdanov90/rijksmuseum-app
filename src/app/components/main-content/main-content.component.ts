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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageSizeOptions = [10, 20, 50, 100];
  public query: any;
  public initialNumOfPages = 1;
  public initialResPerPage = 10;

  public clickedArtObject;
  public detailsObject;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    public networkService: NetworkService,
    public formValuesService: FormValuesService,
    // public dataSourceService: DataSourceService,
    public matDialog: MatDialog,
    private clickedDataService: ClickedDataService,
    private router: Router,
    private navigationService: NavigationService,
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
    this.query.artObjects.map(el => {
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
