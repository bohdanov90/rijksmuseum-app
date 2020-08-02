import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Routing } from './enums/routing.enum';
import { MainComponent } from './components/main/main.component';
import { DetailsComponent } from './components/details/details.component';


const routes: Routes = [
  { path: Routing.MAIN, component: MainComponent },
  { path: Routing.DETAILS, component: DetailsComponent, },
  { path: '**', redirectTo: Routing.MAIN },
  { path: '', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
