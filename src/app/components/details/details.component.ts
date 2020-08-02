import { Component, OnInit } from '@angular/core';
import { ClickedDataService } from '../../services/clicked-data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public artObject;

  constructor(private clickedDataService: ClickedDataService) {}

  ngOnInit(): void {
    this.clickedDataService.getValues$().subscribe(object => this.artObject = object);
    console.log(this.artObject);
  }

}
