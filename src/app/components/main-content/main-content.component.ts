import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { NetworkQueries } from '../../enums/network-queries.enum';
import { tap, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { DataSourceService } from 'src/app/services/data-source.service';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public dataSource: DataSourceService;
  public pageSizeOptions = [10, 20, 50, 100];
  public data: any;
  public initialNumOfPages = 0;
  public initialResPerPage = 10;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    public networkService: NetworkService,
    ) {}

  ngOnInit(): void {
    this.dataSource = new DataSourceService(this.networkService);
    this.dataSource.loadData('Rembrandt').pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(el => this.data = el);
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(
      tap(() => this.loadDataPage()),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public loadDataPage() {
    this.dataSource.loadData('Rembrandt', this.paginator.pageIndex, this.paginator.pageSize, 'relevance').pipe(
      takeUntil(this.onDestroy$)
    ).subscribe(el => this.data = el);
  }
}
