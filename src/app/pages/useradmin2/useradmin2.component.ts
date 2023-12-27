import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { WardsService } from 'src/app/services/wards/wards.service';
import { ActivedirectoryService } from 'src/app/services/ad/ad.service';


@Component({
  selector: 'app-useradmin2',
  templateUrl: './useradmin2.component.html',
  styleUrls: ['./useradmin2.component.css']
})
export class Useradmin2Component {

  iAm: any;
  GotUser: any;
  ListBoxUsers: any;
  ListBoxWards: any;
  addingUser: any;
  selectedWard: string;
  selectedWardName: any;
  formType: any;
  removingUser: any;
  SelectedUser: any;
  SelectedUserText: any;
  GotWards = false;
  wards: [];
  users: [];
  validEmailAddress: boolean;

  constructor(public ads: ActivedirectoryService) {
  }

  ngOnInit() {

    this.populatewards(1);
  }

  userSelected(aUser: any) {
    this.selectedWard = aUser;
    this.SelectedUserText = aUser.label;
  }
  WardSelected(ward: any) {
    this.populateUsers(ward);
    this.selectedWardName = ward.name;
  }

populateUsers(ward: any){

  this.SelectedUserText ="";
  const _this = this;
  _this.GotUser = false;
  _this.ads.getUsers(ward.Ou).subscribe(du => {
    _this.users = du.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
    this.GotUser = true;
  });
}

  populatewards($event) {
    const _this = this;
    this.ads.getWards().subscribe(d => {
      const __this = this;
      // " MMS - Entry Comm-Ash Ward"
      _this.wards = d.filter(x => { return x.name.indexOf(" MMS - Entry ") === 0; });
      _this.wards.forEach((x: any) => { x.name = x.name.substring(13, 99); });
      _this.formType = " MMS - Entry ";
      _this.GotWards = true;
      // has to be all done in here for set up of data adaptor
    });
    this.selectedWardName ="";
    this.SelectedUserText ="";
  }

  FormTypeChanged($event: Event) {
    throw new Error('Method not implemented.');
  }

  addUserBtnClicked() {
    
    this.addingUser === true;  //Fred needs to finish
  }

  removeUserBtnClicked() {
    this.removingUser = true;
  }

  removeUser() {
    this.ads.removeUser(this.selectedWard, this.SelectedUser).subscribe(res => {
      this.populateUsers(this.selectedWard);
      this.removingUser = false;
    });
  }

  removeUserCancel() {
    this.removingUser = false;
  }

  validateEmailAddress($event: Event) {
    let inputEmail ="";
    if ((inputEmail === undefined) || (inputEmail === '')) {
      this.validEmailAddress = false;
      return;
    }

    if (!((/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail)) &&
      (inputEmail.indexOf('@somersetft.nhs.uk') !== -1))) {
      this.validEmailAddress = false;
      return;
    }

    // check its not already in the Group
    const x = this.users.find( (xx:any) => xx.label.toLowerCase() === inputEmail.toLowerCase());
    if (x !== undefined) {
      this.validEmailAddress = false;
      return;
    }

    // passes all the tests
    this.validEmailAddress = true;
  }
  cancelAddUserBtnClicked() {
    throw new Error('Method not implemented.');
  }
  enableSaveAddUser(): boolean {
    throw new Error('Method not implemented.');
  }
  saveAddUserBtnClicked() {
    throw new Error('Method not implemented.');
  }




}
