import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NetworkService } from '../../services/network.service';
import { NetworkQueries } from '../../enums/network-queries.enum';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  public allObjects$: Observable<object[]>;
  public headerImage = NetworkQueries.HEADER_IMAGE;
  public url = NetworkQueries.URL;

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    this.allObjects$ = this.networkService.getAllArtObjects('Rembrandt');
  }
}
