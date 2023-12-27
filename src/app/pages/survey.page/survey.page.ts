import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import { ConfigstateService } from 'src/app/services/configstate/configstate.service';
import { ITrustForm } from 'src/app/interfaces/trustform';
import { FormClass } from 'src/app/classes/cform';
import { FormsService } from 'src/app/services/forms/forms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WardsService } from 'src/app/services/wards/wards.service';
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
  Nos = 0;
  rights=[];
  path = '../../assets/manual.png';
  alttext = 'HELP!';

  constructor(private configService: ConfigstateService, private formsService: FormsService,
    public wardsService: WardsService, private route: ActivatedRoute, private router: Router,
    private kc: KeycloakService) {
    moment.locale('en-gb');
    this.ParentGuid = this.route.snapshot.paramMap.get('guid');
    this.isReadOnly = this.route.snapshot.paramMap.get('readOnly');
    this.wardByParam = this.route.snapshot.paramMap.get('ward');
    this.nextstate = this.configService.state;
    if (this.wardByParam !== null) {
      this.nextstate.config.root.formname = 'mmsResus';
    }
    
  }

  ngAfterViewInit() {
   // this.appEnv = 'PRD';  // force prd for Live testing
  }

  ngOnInit() {
    Survey.FunctionFactory.Instance.register('NumberOfNos', (params) => { return this.Nos; });
    Survey.Serializer.addProperty('survey', {
      name: 'Template:text',
      default: '{}',
      category: 'general'
    });
    this.myForm = (this.configService.state.config.root.data as any).formDetail;
    this.title = this.myForm.name;
    this.myjson = this.myForm.form;
    this.iAm = this.configService.state.config.root.data.Token.name;

    if (this.isReadOnly !== null) {     // assumption of ONLY mms/2 when readonly?
      this.myjson.pages.find(pg => pg.name === 'mms').readOnly = true;
      this.formsService.getItemDetailByGUID('mms22', 'submissions', this.ParentGuid).toPromise().then(result => {
        this.data = result.result;
        this.recordedDate = result.date;
        console.log(this.data);
        this.goForIt();
      });
    } else {
      this.goForIt();
    }
  }
groups
  ImageClick() {
    this.router.navigate(['manualPage']);
  }

  changeformType($event) {
    const _this = this;
    _this.formType = $event.target.value;
    this.resultState = true;
    console.log(this.resultState)
    if (_this.formType !== FormType.mms) {
      _this.isResus = true;
    }
    this.myjson.pages[0].elements[1].defaultValue = _this.formType;

    this.options = [{ label: '**** Department ****', value: -99 }];
    let groups = this.tokenParsed.Roles;
    this.rights = this.tokenParsed.Rights;

    if (groups !== undefined) {
      if (groups.length > 0) {
        // needs server side checks on whats not done yet today.
        groups.sort(function (a, b) { return a.localeCompare(b); });
        this.today = moment().format('L');
        // ToDo: needs get todays entries for EITHER MMS or for RESUS
        this.formsService.getTodaysSubmissions(this.today, this.formType).toPromise().then((data: any[]) => {
          console.log('-_______________________', data);
          let tempGroups: any;
          if (this.formType === FormType.mms) {
            tempGroups = groups.filter(x => !x.startsWith('Resus'));
          } else {
            tempGroups = groups.filter(x => x.startsWith('Resus'));
          }
          groups = tempGroups;

          groups.forEach((value: string, index: number) => {

            //      console.log( '-_______________________', data );
            const tmp = value.replace('Data Entry ', '');
            if (data.some(e => e.ward === tmp) === false) {
              this.options.push({ label: value, value: index });
            } else {
              if (this.formType === FormType.mms) {
                this.options.push({ label: '***' + value + '***', value: index });
              } else {
                let newLabel = value;

                if (data.some(e => e.result['Target Form'] === 'Resus Weekly Checks' && e.ward === tmp) === true) {
                  newLabel = newLabel + '***';
                }
                if (data.some(e => e.result['Target Form'] === 'Resus Daily Checks' && e.ward === tmp) === true) {
                  newLabel = '***' + newLabel;
                }
                this.options.push({ label: newLabel, value: index });
              }
            }
            console.log(this.options);

          });
          console.log(groups);
          this.template = [
            {
              bind: 'ward',
              name: 'ward',
              type: 'option',
              label: 'Department',
              required: true,
              labelWidth: '120px',
              width: '250px',
              component: 'jqxDropDownList',
              options: this.options,
              dropDownHeight: '6',
              autoDropDownHeight: false,
            }
          ];
          setTimeout(() => this.showWardChoices(), 1000);
        }
        );
      } else {
        // console.log( groups.length );
        this.dataValues = { label: groups[0], value: 0 };
        this.ready = true;
        this.nextstate.config.root.currentRole = this.dataValues.label;
        this.configService.updateState(this.nextstate, 'Showform 98');
        this.doWardSelected(this.dataValues.label);
      }
    }


  }

  showWardChoices() {
    this.showWards = true;
    this.iAmReady();
  }

  goForIt() {

    this.dbDetails = this.myForm.database;
    this.tokenParsed = this.nextstate.config.root.data.Token;
    this.nextstate.config.root.showHeader = this.myForm.showHeader;
    this.nextstate.config.root.useRoles = this.myForm.useRoles;
    this.configService.updateState(this.nextstate, 'ShowForm line 72');
    if (this.IsMMS) {
      // Set up to Do an MMS/Resus form
      if (this.wardByParam !== null) {  // this is an Auditors request to do a single ward mms Audit result.
        this.dataValues = { label: this.wardByParam, value: 0 };
        this.nextstate.config.root.currentRole = this.dataValues.label;
        this.configService.updateState(this.nextstate, 'Showform 60');
        this.doWardSelected(this.wardByParam);
      } else {
        // Otherwise it is a normal daily data entry of mms/Resus.

        if (this.myForm.useRoles === true) {
          this.ready = true;
        } else {
          this.iAmReady();
        }
      }

    } else {
      this.iAmReady();
    }
    //    this.iAmReady();
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


  doWardSelected(wardName: string) {
    console.log('Processing ward: ', wardName);

    let ward: any;
    let types: any;
    let subs: Subscription;

    // changed Version number to 2 for the TypeDefinitions.
    const observable = forkJoin([
      this.wardsService.GetOneWard(wardName),
      this.formsService.getRandom('forms', 'typeDefinitions', '"version": 3')
    ]);

    this.myChoices.length = 0;
    this.myTypes.length = 0;
    subs = observable.subscribe({
      next: value => {
        ward = value[0];
        types = value[1];
      },
      
      complete: () => {  // build up list of Question Sections to be displayed.
        const _this = this;
        if (_this.isResus) {
          // is it a YYN style ward
          let myPageRef = ward.Resus;
          let ynyFlags = '';
          if (ward.Resus.substr(3, 1) === '-') {
            myPageRef = ward.Resus.slice(4);
            ynyFlags = ward.Resus.substr(0, 3);
          }
          const myPage = this.myjson.pages.find(x => x.name === myPageRef);
          myPage.visible = true;
          this.myjson.pages[0].visible = false;
          if (this.appEnv === 'uat') {
            this.dbDetails.collection = 'resusUAT';
          } else {
            this.dbDetails.collection = 'resus';
          }
          this.myjson.calculatedValues[0].expression = myPage.name;
          this.myjson.calculatedValues[2].expression = ward.daily.toString();
          this.myjson.calculatedValues[3].expression = ward.Resus.substr(0, 1);
          this.myjson.calculatedValues[4].expression = ward.Resus.substr(1, 1);
          this.myjson.calculatedValues[5].expression = ward.Resus.substr(2, 1);
          this.myjson.calculatedValues[6].expression = '\'' + ward.wardName.substring(8, 99).toString() + '\'';
          // this.dbDetails = this.myForm.database

        } else {
          this.myjson.calculatedValues[0].expression = 'mms';
          types[0].choices.forEach(function (el: any) {
            _this.myChoices.push({ value: el.value, text: el.text });
            if (ward[el.bgValue] === true) {
              _this.myTypes.push(el.value);
            }
          });
          this.myjson.pages[0].visible = false;
          this.myjson.pages[1].visible = false;
          this.myjson.pages[2].visible = true;
          this.myjson.pages[2].elements[0].defaultValue = this.myTypes;
          this.myjson.pages[2].elements[0].choices = this.myChoices;

          if (this.rights !== undefined) {
            if (this.rights.includes('App Debug')) {
              this.myjson.pages[2].elements[0].visible=true;
            }
          }
        }

        if (this.isReadOnly) {  // View existing data
          this.myjson.description = 'MMS - Viewing entry for ' + ward.wardName + ' recorded on ' + this.recordedDate;
          this.myjson.title = 'Medicines Management System - historical data viewer.';
          this.myjson.completeText = 'Back';
        } else {
          if (this.isResus) {
            this.myjson.title = 'Resus Audit System ' + 'Test'; //this.appEnv;
            this.myjson.description = 'Resus - New entry for ' + ward.wardName + ' on '
              + (new Date().toLocaleDateString('en-GB'));
          } else {
            this.myjson.title = 'Medicines Management System ' + 'Test'; //tthis.appEnv;
            this.myjson.description = 'MMS  New entry for ' + ward.wardName + ' on '
              + (new Date().toLocaleDateString('en-GB'));
          }

          this.myjson.completeText = 'Save';
        }
        this.nextstate.config.root.data.ward = ward;
        this.nextstate.config.root.currentRole = wardName;
        this.configService.updateState(this.nextstate, 'ShowForm 200');
        this.doSurvey = true;
        this.ready = true;

        const survey = new Model(this.myjson);
        survey.onAfterRenderQuestion.add((survey, options) => {
          if (!options.question['popupdescription']) {
            return;
          }
          // Add a button;
          const btn = document.createElement('button');
          btn.className = 'btn btn-info btn-xs';
          btn.innerHTML = 'More Info';
          btn.onclick = function () {
            // showDescription(question);
            alert(options.question['popupdescription']);
          };
          const header = options.htmlElement.querySelector('h5');
          const span = document.createElement('span');
          span.innerHTML = '  ';
          header.appendChild(span);
          header.appendChild(btn);
        });

        survey.onValueChanging.add((s:any, opts) => {
          const _that = this;
          if (s.variablesHash.resuspage !== 'mms') {
            if (opts.question.getType() === 'radiogroup') {
              if (opts.oldValue === undefined && opts.value === 'NO') {
                _that.Nos += 1;
              } else if (opts.oldValue === 'Yes' && opts.value === 'NO') {
                _that.Nos += 1;
              } else if (opts.oldValue === 'NO' && opts.value === 'Yes') {
                _that.Nos -= 1;
              }
            }
            console.log(opts);
          }
        });
        survey.onComplete.add((sender, options) => {
          this.sendData(sender.data);
        });
        survey.onUpdateQuestionCssClasses
        .add(function (_survey, options) {
          const classes = options.cssClasses;
          console.debug(options.question.title);
          //                 console.log( _survey, options );
          classes.root = 'sq-root';
          classes.title = 'sq-title';
          classes.item = 'sq-item';
          classes.label = 'sq-label';

          if (options.question.isRequired) {
            classes.title = 'sq-title sq-title-required';
            classes.root = 'sq-root sq-root-required';
          }

          if ((options.question.getType() === 'checkbox')) {
            classes.root = 'sq-root sq-root-cb';
          }
          if (options.question.getType() === 'radiogroup' ) {
            classes.root ='sq-root sq-root-required';
          }
          if (options.question.getType() === 'text') {
            if (options.question.indent > 0) {
              classes.root = 'sq-root sq-root-txt';
            } else {
              classes.root = 'sq-root sq-root-txtin';
            }
          }
          if (options.question.title.startsWith('***')) {
            classes.title = 'sq-title my-redtext';
          } else if (options.question.title.startsWith('**')) {
            classes.title = 'sq-title my-bluetext';
          } else if (options.question.title.startsWith('*')) {
            classes.title = 'sq-title my-greentext';
          }
        });
        this.surveyModel = survey;
      }
    });
    // subs.unsubscribe();
    console.log(wardName);
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

  onClickWeekly($event) {
    if (this.formType === 'MMS') {
    } else {
      this.router.navigate(['weekly']);
    }
  }



  onClickreport($event) {
    if (this.formType === 'MMS') {
      window.open('https://bi.tst.nhs.uk/pbireports/powerbi/Published%20Reports/Medicines%E2%80%99%20Security%20Dashboard?rs:embed=true',
        '_blank');
    } else {
      window.open('https://bi.tst.nhs.uk/pbireports/powerbi/Published%20Reports/Resus%20Medicines%E2%80%99%20Security%20Dashboard',
        '_blank');
    }
  }


  // A ward has been selected
  onClickDoWard($event: any) {
    if ($event.currentTarget.textContent === 'OK') {
      if (this.dataValues.label.startsWith('***')) {
        this.myForm.form.calculatedValues[1].expression = true;
      }
      const wardName = this.dataValues.label.replace('Data Entry ', '').replace('***', '').replace('***', '');
      this.doWardSelected(wardName);
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
            to: 'neil.russell@somersetft.nhs.uk',
            subject: 'Form',
            from: this.tokenParsed.email
          };
        }
        if (this.tokenParsed.hasOwnProperty('email')) {
          details.email = this.tokenParsed.email;
        } else {
          details.email = '';
        }
        // ToDo: details.sendEmail = true;  // Needs to be a flag on the FormDefinition that sets this and details of who?
        if (this.nextstate.config.root.formname.startsWith('mms')) {
          details.ward_ID = { $oid: this.nextstate.config.root.data.ward.id };
        }


        myResults.database = this.dbDetails;
        if (this.configService.state.config.root.currentRole !== null) {
          myResults.ward = this.configService.state.config.root.currentRole;
        }
        if (this.wardByParam !== null) {
          myResults.addAsAudit = this.ParentGuid;
        }
        if (this.isResus) {
          if (result.Comment) {
            details.sendEmail = {
              to: this.nextstate.config.root.ResusEmailsTo,
              subject: 'Audit comment for ' + result['Target Form'] + ' ' + myResults.ward.replace('Resus', '')
            };
          }
        }

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
