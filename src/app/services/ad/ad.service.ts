import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';
import { ConfigstateService } from 'src/app/services/configstate/configstate.service'
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json')
};

@Injectable({
  providedIn: 'root'
})

export class ActivedirectoryService {
  adEvn = environment.appenv.toUpperCase();
  iAm: any;
  constructor(private http: HttpClient, private newConfig: ConfigstateService) {
    this.iAm = this.newConfig.state.config.root.data.Token.name;
    console.log("ADS Started");
  }

  // add a user by email to a given AD Group
  addUser(ward: string, user: string) {
    const data = { environment: this.adEvn, groupDN: ward, userDN: user, actionedBy: this.iAm, action: 'AddUser' };
    const myUrl = this.newConfig.state.config.root.dataUrl + 'ActiveDirectory/PutUserinGroup';
    return this.http.post(myUrl, JSON.stringify(data), httpOptions).pipe(map(res => {
      return res;
    }));
  }
  
  // remove a user from an AD Group
  removeUser(ward: string, user: string) {
    const data = { environment: this.adEvn, groupDN: ward, userDN: user, actionedBy: this.iAm, action: 'RemoveUser' };

    const myUrl = this.newConfig.state.config.root.dataUrl + 'ActiveDirectory/RemoveUserFromGroup';
    return this.http.post(myUrl, JSON.stringify(data), httpOptions).pipe(map(res => {
      return res;
    }));
  }

  // get list of users in an AD Group
  getUsers(ward: string) {
    const myUrl = this.newConfig.state.config.root.dataUrl
      + 'ActiveDirectory/GetUsers?environment=' +this.adEvn+'&groupDN=' + encodeURIComponent(ward);
    return this.http.get(myUrl, httpOptions).pipe(map((res: any) => {
      return res.Users;
    }));

  }

  // Get the list of AD Groups
  getWards() {
    const myUrl = this.newConfig.state.config.root.dataUrl + 'ActiveDirectory/GetGroups?environment='+this.adEvn;
    return this.http.get(myUrl, httpOptions).pipe(map((res: any) => {
      return res;
    }));
  }
}