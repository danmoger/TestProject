import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs/internal/observable/of';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})

export class FormsService {
    appEnv = environment.appenv;
    resus = '';

   constructor(private http: HttpClient) {
        if (this.appEnv === 'uat') {
            //    this.resus = 'UAT'; // Forced for Live prod testing
        }
    }

    public getTodaysResusShortList(){
        const collection = 'resus_view_Last_Weekly' + this.resus;
        const myUrl = environment.dataUrl +
            'mongo/filterCollection?db=' + 'mms2' + '&collection=' + collection + '&filter={}';
        return this.http.get(myUrl).pipe(map(resp => {
            // console.log( resp );
            return resp;
        }), catchError(err => {
            console.log(err);
            return of([]);
        }));
    }
}
