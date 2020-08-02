import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../services/navigation.service';
import { NetworkQueries } from '../../enums/network-queries.enum';
import { DataService } from '../../services/data.service';
import { DetailedData } from '../../interfaces/detailed-data.interface';
import { ArtObject } from '../../interfaces/artObject.interface';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  public details: ArtObject;
  public title: string;
  public webImage: string;
  public description: string;

  constructor(
    private dialogRef: MatDialogRef<any>,
    private navigationService: NavigationService,
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) data: DetailedData) {
    this.details = data?.artObject;
    this.title = data?.artObject?.title;
    this.webImage = data?.artObject?.webImage?.url;
    this.description = data?.artObject?.description;
  }

  public viewDetails(): void {
    this.dialogRef.close();
    if (this.details !== null && this.details !== undefined) {
      this.navigationService.navigateDetails(this.details.objectNumber);
    } else {
      this.navigationService.navigateMain(
        '',
        this.dataService.initialNumOfPages,
        this.dataService.initialResPerPage,
        NetworkQueries.RELEVANCE,
      );
    }
  }

  public closePopup(): void {
    this.dialogRef.close();
  }
}
