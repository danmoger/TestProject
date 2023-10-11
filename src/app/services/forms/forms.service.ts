import { Injectable } from '@angular/core';
//import { Dictionary, IForms } from '../../../utils/dictionary';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { ConfigstateService } from '../configstate/configstate.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import 'moment/min/locales';
import { FormType } from '../../../utils/enum';
import { environment } from 'src/environments/environment';


const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})

export class FormsService {
    //    myForms: Dictionary<IForms>;
    appEnv = environment.appenv;
    resus = '';

    constructor(private http: HttpClient, private newConfig: ConfigstateService) {
        moment.locale('en-GB');
        if (this.appEnv === 'uat') {
            //    this.resus = 'UAT'; // Forced for Live prod testing
        }
    }

    public getForm(fName: string): any {
        return this.http.get(this.newConfig.state.config.root.dataUrl +
            'mongo/filterCollection?db=forms&collection=PublishedForms&filter={"_id":"' + fName.toUpperCase() + '"}').pipe(map(resp => {
                const data = resp[0];
                console.log(data);
                return data.Root;
            }), catchError(err => {
                console.log(err);
                return of([]);
            }));
    }

    public saveForm(data: any): any {
        const myUrl = this.newConfig.state.config.root.dataUrl + this.newConfig.state.config.root.saveFormDefinition;
        console.log(myUrl, data);
        return this.http.post(myUrl, JSON.stringify(data), httpOptions).pipe(map((res: Response) => {

            return res;
        }));
    }

    // get list of forms, highest dot version is returned
    public ListFormsv() {
        const myUrl = this.newConfig.state.config.root.dataUrl + 'forms/ListFormsv';
        return this.http.get(myUrl, httpOptions).pipe(map((res: Response) => {
            return res;
        }));
    }

    public getRandom(db: string, col: string, filter: string): Observable<any> {
        return this.http.get(this.newConfig.state.config.root.dataUrl + 'mongo/filterCollection?db=' +
            db + '&collection=' + col + '&filter={' + filter + '}');
            /* .pipe(map(resp => {
                return resp[0];
            }), catchError(err => {
                console.log(err);
                return of([]);
            })); */
    }

    public getItemDetailByGUID(dbName: string, collection: string, guid: string): Observable<any> {

        const myUrl = this.newConfig.state.config.root.dataUrl +
            'mongo/filterCollection?db=' + dbName + '&collection=' + collection + '&filter={%20%22_id%22:%20ObjectId(%22' + guid + '%22)' +
            '%20}';
        return this.http.get(myUrl).pipe(map(resp => {
            // console.log( resp );
            return resp[0];
        }), catchError(err => {
            console.log(err);
            return of([]);
        }));
    }

    public postFormResponses(data: string): Observable<any> {
        const myUrl = this.newConfig.state.config.root.dataUrl + this.newConfig.state.config.root.PostFormDataURl;
        console.log(myUrl, data);
        return this.http.post(myUrl, JSON.stringify(data), httpOptions).pipe(map((res: Response) => {
            return res;
        }));
    }

    public GetaForm(oid: string): Observable<any> {
        const myUrl = this.newConfig.state.config.root.dataUrl + 'forms/GetItem?oId=' + oid;
        return this.http.get(myUrl, httpOptions).pipe(map((res: Response) => {
            return res;
        }));
    }

}
