import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ConfigstateService } from 'src/app/services/configstate/configstate.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MMSResus';

  loginInfo: any;
  authenticated: boolean = false;

  constructor(private kc: KeycloakService, private newConfig: ConfigstateService) {
    const kk = kc.getKeycloakInstance();
    const token: any = kk.tokenParsed;
    this.loginInfo = token;
    if(this.loginInfo.hasOwnProperty('Rights')){
      if(this.loginInfo.Rights.includes('Administrators')){
        this.authenticated = true;
      }
    }
    this.authenticated = true;
  } 

  logout() {
    this.kc.logout(window.location.origin).then(() => {
           this.kc.clearToken();
    });
  }
}
