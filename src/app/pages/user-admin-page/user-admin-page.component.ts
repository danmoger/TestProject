import { Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import { WardsService } from 'src/app/services/wards/wards.service';
import { ActivedirectoryService } from 'src/app/services/ad/ad.service';

@Component({
  selector: 'app-user-admin-page',
  templateUrl: './user-admin-page.component.html',
  styleUrls: ['./user-admin-page.component.css']
})
export class UserAdminPageComponent  implements OnInit {
 

  formType = 'none';
  wards: [];
  users: [];
  selectedWard: string;
  selectedWardName: string;
  SelectedUser: any;
  SelectedUserText: string;
  selectedUserIndex = -1;
  addingUser = false;
  removingUser = false;
  validEmailAddress = false;
  iAm: any;

  
  constructor  (public ads: ActivedirectoryService ){
  }

  ngAfterViewInit(){
    console.log()
  }

  ngOnInit () {
    this.populatewards(1);
  }
 
  populatewards($event) {
    const _this = this;
  this.ads.getWards().subscribe(d => {
    const __this = this;
// " MMS - Entry Comm-Ash Ward"
    _this.wards = d.filter(x => {  return x.name.indexOf(" MMS - Entry ") === 0; });
    _this.wards.forEach((x: any) => { x.name = x.name.substring(13, 99); });
    _this.formType = " MMS - Entry ";
    // has to be all done in here for set up of data adaptor
  });
}

populateUsers(ward: any) {
  const _this = this;
  _this.ads.getUsers(ward.Ou).subscribe(du => {
      _this.users = du.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
      });
    }
userSelected(user: any) {
  console.log(user);
}
  
}