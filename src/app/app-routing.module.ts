import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualPageComponent } from './pages/manual-page/manual-page.component';
import { WeeklyComponent } from './pages/reports/weekly/weekly.component';
import { SurveyPage } from './pages/survey.page/survey.page';

const routes: Routes = [
  { path: 'weekly', component: WeeklyComponent },
  { path: 'survey', component: SurveyPage },
  { path: 'manualPage', component: ManualPageComponent },
  { path: '', component: SurveyPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
