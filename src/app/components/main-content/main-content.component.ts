import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { NetworkQueries } from '../../enums/network-queries.enum';
import { tap, takeUntil, map } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit, OnDestroy {
  public headerImage = NetworkQueries.HEADER_IMAGE;
  public url = NetworkQueries.URL;

  public pageEvent: PageEvent;
  public dataSource: null;
  public itemsLength: number;
  public pageIndex: number;
  public pageSize: number;
  public pageSizeOptions = [10, 15, 25, 50, 100];

  public initialNumOfPages = 0;
  public initialResPerPage = 10;

  public artObjects = NetworkQueries.ART_OBJECTS;
  public count = NetworkQueries.COUNT;

  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    this.getServerData();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public getServerData(event?: PageEvent) {
    if (!event) {
      this.networkService.getQuery('Rembrandt', this.initialNumOfPages, this.initialResPerPage).pipe(
        tap(response => {
        this.dataSource = response[this.artObjects];
        this.itemsLength = response[this.count];
        }),
        takeUntil(this.onDestroy$),
      ).subscribe();
    } else {
      this.networkService.getQuery('Rembrandt', event?.pageIndex, event?.pageSize).pipe(
        tap(response => {
        this.dataSource = response[this.artObjects];
        this.itemsLength = response[this.count];

        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        }),
        takeUntil(this.onDestroy$),
      ).subscribe();
    }

    return event;
  }
}
