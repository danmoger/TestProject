import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs/internal/observable/of';

import { ConfigstateService } from 'src/app/services/configstate/configstate.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})

export class MyFormsService {
    appEnv = environment.appenv;
    resus = '';

   constructor(private http: HttpClient, private newConfig: ConfigstateService) {
    
        if (this.appEnv === 'uat') {
            //    this.resus = 'UAT'; // Forced for Live prod testing
        }
    }

    public getTodaysResusShortList(){
        const collection = 'resus_view_Last_Weekly' + this.resus;
        const myUrl = environment.dataUrl +
            'mongo/filterCollection?db=' + 'mms22' + '&collection=' + collection + '&filter={}';
        return this.http.get(myUrl).pipe(map(resp => {
            // console.log( resp );
            return resp;
        }), catchError(err => {
            console.log(err);
            return of([]);
        }));
    }

    public getForm():any{
        const myUrl = 'http://formsauthapitest.tst.nhs.uk/api/mongo/filterCollection?db=forms&collection=PublishedForms&filter=%7B%22_id%22%3A%22MMS2COMBINED2%22%7D';
        return this.http.get(myUrl).pipe(map((resp: any) => {
            const data = resp[0];
            //console.log(data);
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

    public getRandom(db: string, col: string, filter: string): any {
        return this.http.get(this.newConfig.state.config.root.dataUrl + 'mongo/filterCollection?db=' +
            db + '&collection=' + col + '&filter={' + filter + '}').pipe(map(resp => {
                return resp[0];
            }), catchError(err => {
                console.log(err);
                return of([]);
            }));
    }
}
