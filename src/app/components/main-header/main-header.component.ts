import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormValuesService } from '../../services/form-values.service';
import { NetworkQueries } from 'src/app/enums/network-queries.enum';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent {
  public sortValues = this.dataService.sortValues;
  public form: FormGroup = new FormGroup({
    sort: new FormControl(NetworkQueries.RELEVANCE),
    search: new FormControl(''),
  });

  constructor(
    private formValuesService: FormValuesService,
    private dataService: DataService,
  ) {}

  public submitForm(): void {
    this.formValuesService.setValues(this.form.value);
  }
}
