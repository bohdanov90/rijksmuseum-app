import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  public title: string;
  public webImage: string;
  public description: string;

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) clickedArtObject,
    ) {
    this.title = clickedArtObject.title;
    this.webImage = clickedArtObject.webImage.url;
    this.description = clickedArtObject.description;
  }

  ngOnInit(): void {

  }

  viewDetails() {

  }

  closeDialog() {
    this.dialogRef.close();
  }
}
