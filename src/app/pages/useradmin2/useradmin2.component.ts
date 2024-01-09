import { Component, ElementRef, ViewChild, OnInit, OnChanges, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { WardsService } from 'src/app/services/wards/wards.service';
import { ActivedirectoryService } from 'src/app/services/ad/ad.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-useradmin2',
  templateUrl: './useradmin2.component.html',
  styleUrls: ['./useradmin2.component.css']
})
export class Useradmin2Component {

  //@ViewChildren('adduserbit') ref: QueryList<any>;

  /* @ViewChild('inputEmail') set inputEmail(
     elementRef: ElementRef<HTMLInputElement> | undefined
   ) {
     console.log(elementRef);
   }
  */
  iAm: any;
  GotUser= false;
  ListBoxUsers: any;
  ListBoxWards: any;
  addingUser = false;
  NewUserEmail: string;
  selectedWard: any;
  selectedWardName: string;
  formType: any;
  removingUser = false;
  SelectedUser: any;
  SelectedUserText: string;
  GotWards = false;
  wards: [];
  users: [];
  validEmailAddress = false;

  constructor(public ads: ActivedirectoryService, public cd: ChangeDetectorRef, private router: Router) {
  }

  BackToStart() {
    this.router.navigate(['survey']);
  }

  ngOnInit() {

    this.formType = "none";
  }

  userSelected(aUser: any) {
    if (this.addingUser ===false && this.removingUser === false) {
      this.SelectedUser = aUser;
      this.SelectedUserText = aUser.label;
    }
  }

  WardSelected(ward: any) {
    if (this.addingUser === false && this.removingUser === false) {
      this.populateUsers(ward);
      this.selectedWardName = ward.name;
      this.selectedWard = ward;
    }
  }

  populateUsers(ward: any) {

    this.SelectedUserText = "";
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
      // " Resus - "
      _this.wards = d.filter(x => { return (x.name.indexOf(this.formType) === 0 && x.name.indexOf("YDH") === -1) });
      _this.wards.forEach((x: any) => { x.name = x.name.substring(this.formType.length, 99); });

      _this.GotWards = true;
      // has to be all done in here for set up of data adaptor
    });
    this.selectedWardName = "";
    this.SelectedUserText = "";
  }

  FormTypeChanged($event: any) {
    this.formType = $event.target.value;
    this.populatewards(1);
  }

  ClickedAddUserBtn() {

    this.addingUser = true;  //Fred needs to finish
  }

  ClickedRemoveUserBtn() {
    this.removingUser = true;
  }

  removeUser() {
    this.ads.removeUser(this.selectedWard.Ou, this.SelectedUser.value).subscribe(res => {
      this.populateUsers(this.selectedWard);
      this.removingUser = false;
    });
  }

  CancelRemoveUser() {
    this.removingUser = false;
  }

  validateEmailAddress($event: any) {
    let email = ($event.target).value.toLowerCase();

    if (!((/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) &&
      (email.indexOf('@somersetft.nhs.uk') !== -1))) {
      this.validEmailAddress = false;
      return;
    }

    // check its not already in the Group
    const x = this.users.find((xx: any) => xx.label.toLowerCase() === email.toLowerCase());
    if (x !== undefined) {
      this.validEmailAddress = false;
      return;
    }


    // passes all the tests
    this.NewUserEmail = email;
    this.validEmailAddress = true;
  }

  cancelAddUserBtnClicked() {
    this.addingUser = false;
  }

  saveAddUserBtnClicked() {
    this.ads.addUser(this.selectedWard.Ou, this.NewUserEmail).subscribe(res => {
      this.populateUsers(this.selectedWard);
      this.addingUser = false;
      this.NewUserEmail = '';
      this.validEmailAddress = false;
    });
  }
}
