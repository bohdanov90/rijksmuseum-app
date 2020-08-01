import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { NetworkQueries } from '../../enums/network-queries.enum';
import { tap, takeUntil, mergeMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { DataSourceService } from 'src/app/services/data-source.service';
import { FormValuesService } from '../../services/form-values.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
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

  public displayOnHover = false;
  public clickedArtObject;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    public networkService: NetworkService,
    public formValuesService: FormValuesService,
    public dataSourceService: DataSourceService,
    public matDialog: MatDialog,
    ) {}

  ngOnInit(): void {
    this.dataSource = new DataSourceService(this.networkService, this.formValuesService);
  }

  ngAfterViewInit(): void {
    this.paginator.page.pipe(
      tap(() => this.loadDataPage()),
    ).subscribe();

    this.getFormData().pipe(
      takeUntil(this.onDestroy$),
      ).subscribe(el => {
        this.data = el;
        this.toggleDataDisplay();
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public loadDataPage() {
    this.dataSource.loadData(
      '',
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.formValuesService.sortValues[0].apiName
    ).pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(el => this.data = el);
  }

  public getFormData() {
    return this.formValuesService.getValues$().pipe(
      tap(query => console.log(query)),
      mergeMap(response => {
        if (!response) {
          return this.dataSource.loadData(
            '',
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.formValuesService.sortValues[0].apiName
          );
        } else {
          return this.dataSource.loadData(response[this.search], this.paginator.pageIndex, this.paginator.pageSize, response[this.sort]);
        }
      }),
    );
  }

  public toggleDataDisplay() {
    if (this.data !== undefined && this.data !== null) {
      this.data.count === 0 ? this.displayData = false : this.displayData = true;
    }
  }

  public onHover() {
    this.displayOnHover = true;
  }

  public offHover() {
    this.displayOnHover = false;
  }

  public getDetailedData(event) {
    this.data.artObjects.map(el => {
      if (event.target.currentSrc === el.headerImage.url) {
        this.clickedArtObject = el;
      }
    });

    this.networkService.getDetailedQuery(this.clickedArtObject.objectNumber).subscribe(el => console.log(el));
  }

  public openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.data = this.clickedArtObject;

    this.matDialog.open(DetailsComponent, dialogConfig);
  }
}
