import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManualPageComponent } from './pages/manual-page/manual-page.component';
import { monthlyComponent } from './pages/reports/monthly/monthly.component';
import { SurveyPage } from './pages/survey.page/survey.page';
import { UserAdminPageComponent } from './pages/user-admin-page/user-admin-page.component';
import { Useradmin2Component } from './pages/useradmin2/useradmin2.component';


const routes: Routes = [
  { path: 'Monthly', component: monthlyComponent },
  { path: 'survey', component: SurveyPage },  
  { path: 'manualPage/:page', component: ManualPageComponent },
  { path: 'useradmin', component: UserAdminPageComponent},
  { path: 'useradmin2', component: Useradmin2Component},
  { path: '', component: SurveyPage }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
