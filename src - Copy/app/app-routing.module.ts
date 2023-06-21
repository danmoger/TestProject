import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeeklyComponent } from './reports/weekly/weekly.component';

const routes: Routes = [
  { path: 'weekly', component: WeeklyComponent },
  { path: '', component: WeeklyComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
