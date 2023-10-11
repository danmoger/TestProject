import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { ConfigstateService } from 'src/app/services/configstate/configstate.service';
import { ITrustForm } from 'src/app/interfaces/trustform';
import { FormClass } from 'src/app/classes/cform';
import { FormsService } from 'src/app/services/forms/forms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { forkJoin, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormType } from 'src/utils/enum';
import { Model } from "survey-core";
import * as Survey from 'survey-core';



const surveyJson = null;

Survey.JsonObject.metaData.addProperty('questionbase', 'popupdescription:text');
Survey.JsonObject.metaData.addProperty('page', 'popupdescription:text');

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'survey-page',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.css']
})
// tslint:disable-next-line:component-class-suffix
export class SurveyPage implements OnInit, AfterViewInit {  
  
  surveyModel: Model;
  myForm: ITrustForm = new FormClass();
  data: any;
  title: string;
  myjson: any;
  resultData = {};
  isReadOnly: string;
  wardByParam: string = null;
  ParentGuid: string = null;
  today: string;
  recordedDate: string;
  ready = false;
  IsMMS = false;
  okEnabled = false;
  nextstate: any;
  dbDetails: any;
  tokenParsed: any;
  dataValues: any;
  template: any;
  options: any;
  showWards = false;
  doSurvey = false;
  iAm: any;
  offset = 1;
  isResus = false;
  myTypes = [];
  myChoices = [];
  formType = FormType.none;
  appEnv = environment.appenv;
  isOnlyMMS = false;
  okState = 'danger';
  resultState = false;

  path = '../../assets/manual.png';
  alttext = 'HELP!';

  constructor(private configService: ConfigstateService, private formsService: FormsService,
    private route: ActivatedRoute, private router: Router,
    private kc: KeycloakService) {
    moment.locale('en-gb');
    this.ParentGuid = this.route.snapshot.paramMap.get('guid');
    this.isReadOnly = this.route.snapshot.paramMap.get('readOnly');
    this.wardByParam = this.route.snapshot.paramMap.get('ward');
    this.nextstate = this.configService.state; 
  }

  ngAfterViewInit() {
    this.appEnv = 'PRD';  // force prd for Live testing
  }

  ngOnInit() {
    // Survey.Serializer.addProperty('survey', {
    //   name: 'Template:text',
    //   default: '{}',
    //   category: 'general'
    // });
    this.myForm = (this.configService.state.config.root.data as any).formDetail;
    this.title = this.myForm.name;
    this.myjson = this.myForm.form;
    this.iAm = this.configService.state.config.root.data.Token.name;

    this.goForIt();
  }

  goForIt() {

    this.dbDetails = this.myForm.database;
    this.tokenParsed = this.nextstate.config.root.data.Token;
    this.nextstate.config.root.showHeader = this.myForm.showHeader;
    this.nextstate.config.root.useRoles = this.myForm.useRoles;
    this.configService.updateState(this.nextstate, 'ShowForm line 72');
    this.iAmReady();
  }

  BindingComplete($event) {
    console.log('ToDo');
  }

  iAmReady() {

    if (this.nextstate.config.root.useRoles) {
      if (this.nextstate.config.root.currentRole !== null) {
        this.doSurvey = true;
      } else {
        this.doSurvey = false;
      }
    } else {
      const survey = new Model(this.myjson);
      this.surveyModel = survey;
      this.doSurvey = true;
      survey.onComplete.add((sender, options) => {
        this.sendData(sender.data);
      });
    }
    this.ready = true;
    console.log('GO!');
    console.log(this.nextstate);
  }

  formDataChanged(event: Event) {
    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    // Change to allow all IF isResus === true
    if (selectedIndex !== 0) {
      this.dataValues = this.options[selectedIndex];
      if (((this.dataValues.label[0] === '*') && (this.formType !== FormType.weeklyResus))) {
        this.okEnabled = false;
        //this.okState = 'it not ok';
      } else {
        this.okEnabled = true;
        //this.okState = 'OK';
      }
    } else {
      this.okEnabled = false;
      //this.okState = 'it not ok';
    }
  }

  public sendData(result) {

    if (this.nextstate.config.root.isAppMode === true || this.wardByParam !== null) {
      if (!this.isReadOnly) {
        const myResults: any = {};
        myResults.result = result;
        delete myResults.result.Domains;
        const details: any = {};
        details.name = this.tokenParsed.given_name + ' ' + this.tokenParsed.family_name;
        details.formName = this.nextstate.config.root.formname;
        if (this.nextstate.config.root.data.formDetail.form.hasOwnProperty('template')) {
          details.template = this.nextstate.config.root.data.formDetail.form.template;
          details.sendEmail = {
            to: 'daniel.moger@somersetft.nhs.uk',
            subject: 'Training Evaluation Form',
            from: this.tokenParsed.email
          };
        }
        if (this.tokenParsed.hasOwnProperty('email')) {
          details.email = this.tokenParsed.email;
        } else {
          details.email = '';
        }

        myResults.database = this.dbDetails;

        myResults.details = details;
        this.formsService.postFormResponses(myResults).subscribe(resp => {
          console.log(resp, new Date());
          //          this.kc.clearToken();
          this.kc.logout().then(() => {
            this.router.navigate(['survey']);
            // this.kc.clearToken();
          });
          //           this.kc.logout().then(() => this.kc.clearToken());
          if (this.isResus) {
            //  this.router.navigate(['results']);
          }
        });
      } else {
        //  this.location.back(); /// ToDo what happens now after a readonly view?
      }
    } else {
      //  this.resultData = result;
    }
  }
}
