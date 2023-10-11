import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyPage } from './pages/survey.page/survey.page';

const routes: Routes = [
  { path: 'survey', component: SurveyPage },
  { path: '', component: SurveyPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
