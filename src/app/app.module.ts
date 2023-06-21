import { APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SurveyModule } from "survey-angular-ui";

import { FormsService } from './services/forms/forms.service';
import { ConfigstateService } from './services/configstate/configstate.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './_top/header/header.component';
import { WeeklyComponent } from './pages/reports/weekly/weekly.component';
import { SurveyPage } from './pages/survey.page/survey.page'

import { initializer } from '../utils/app-init';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'https://sso.tst.nhs.uk/auth',
        realm: 'SIDER',
        clientId: 'mms-app'
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      }
    });
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WeeklyComponent,
    SurveyPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    SurveyModule
  ],
  providers: [
    {
    provide: APP_INITIALIZER,
    useFactory: initializer,
    multi: true,
    deps: [FormsService, HttpClient, KeycloakService, ConfigstateService],
    //deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
