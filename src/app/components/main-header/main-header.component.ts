import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormValuesService } from '../../services/form-values.service';
import { NetworkQueries } from 'src/app/enums/network-queries.enum';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent {
  public sortValues = [
    {
      displayName: 'Order by: Relevance',
      apiName: 'relevance',
    },
    {
      displayName: 'Order by: Type',
      apiName: 'objecttype',
    },
    {
      displayName: 'Order by: Newest first',
      apiName: 'achronologic',
    },
    {
      displayName: 'Order by: Oldest first',
      apiName: 'chronologic',
    }
  ];

  form: FormGroup = new FormGroup({
    sort: new FormControl(NetworkQueries.RELEVANCE),
    search: new FormControl(''),
  });

  constructor(public formValuesService: FormValuesService) { }

  submitForm() {
    this.formValuesService.setValues(this.form.value);
  }
}
