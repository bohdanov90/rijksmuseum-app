import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';

const MaterialComponents = [
  MatCardModule,
  MatGridListModule,
  MatPaginatorModule,
];

@NgModule({
  imports: [
    MaterialComponents,
  ],
  exports: [
    MaterialComponents,
  ],
})
export class MaterialModule { }
