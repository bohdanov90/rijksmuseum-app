import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormValuesService } from '../../services/form-values.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  public sortValues = this.formValuesService.sortValues;
  form: FormGroup = new FormGroup({
    sort: new FormControl(this.sortValues[0].apiName),
    search: new FormControl(''),
  });

  constructor(public formValuesService: FormValuesService) { }

  ngOnInit(): void {}

  submitForm() {
    this.formValuesService.setValues(this.form.value);
  }
}
