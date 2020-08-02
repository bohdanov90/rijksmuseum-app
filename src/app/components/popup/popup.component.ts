import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClickedDataService } from '../../services/clicked-data.service';
import { NavigationService } from '../../services/navigation.service';

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
    private clickedDataService: ClickedDataService,
    private navigationService: NavigationService,
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
    if (this.clickedObject !== null && this.clickedObject !== undefined) {
      this.navigationService.navigateDetails(this.clickedObject.objectNumber);
    } else {
      this.navigationService.navigateMain('', 0, 10, 'relevance');
    }
  }

  closePopup() {
    this.dialogRef.close();
  }
}
