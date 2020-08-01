import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Routing } from '../../enums/routing.enum';
import { ClickedDataService } from '../../services/clicked-data.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  public title: string;
  public webImage: string;
  public description: string;

  public clickedObject;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private router: Router,
    private clickedDataService: ClickedDataService,
    @Inject(MAT_DIALOG_DATA) clickedArtObject,
    ) {
    this.title = clickedArtObject.title;
    this.webImage = clickedArtObject.webImage.url;
    this.description = clickedArtObject.description;
  }

  ngOnInit(): void {
    this.clickedDataService.getValues$().subscribe(object => this.clickedObject = object);
  }

  viewDetails() {
    this.dialogRef.close();
    // console.log(this.clickedObject);
    this.router.navigate([`/api/en/collection/${this.clickedObject.objectNumber}`]);
  }

  closePopup() {
    this.dialogRef.close();
    // this.router.navigate([Routing.MAIN]);
  }
}
