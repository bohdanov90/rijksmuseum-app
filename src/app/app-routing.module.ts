import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Routing } from './enums/routing.enum';
import { MainComponent } from './components/main/main.component';
import { PopupComponent } from './components/popup/popup.component';


const routes: Routes = [
  { path: Routing.MAIN, component: MainComponent },
  { path: Routing.DETAILS, component: PopupComponent },
  // { path: '**', redirectTo: Routing.MAIN },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
