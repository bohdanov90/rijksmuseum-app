import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

  public details;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private navigationService: NavigationService,
    @Inject(MAT_DIALOG_DATA) data) {
    // console.log('DATA', data);
    this.details = data?.artObject;
    this.title = data?.artObject?.title;
    this.webImage = data?.artObject?.webImage?.url;
    this.description = data?.artObject?.description;
  }

  ngOnInit(): void {}

  viewDetails() {
    this.dialogRef.close();
    // console.log(this.details);
    if (this.details !== null && this.details !== undefined) {
      this.navigationService.navigateDetails(this.details.objectNumber);
    } else {
      this.navigationService.navigateMain('', 0, 10, 'relevance');
    }
  }

  closePopup() {
    this.dialogRef.close();
  }
}
