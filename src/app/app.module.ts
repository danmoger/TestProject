import { APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SurveyModule } from "survey-angular-ui";
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { FormsService } from './services/forms/forms.service';
import { ConfigstateService } from './services/configstate/configstate.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SurveyPage } from './pages/survey.page/survey.page'

import { initializer } from '../utils/app-init';

@NgModule({
  declarations: [
    AppComponent,
    SurveyPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    SurveyModule,
    PdfViewerModule
  ],
  providers: [
    {
    provide: APP_INITIALIZER,
    useFactory: initializer,
    multi: true,
    deps: [FormsService, HttpClient, KeycloakService, ConfigstateService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
