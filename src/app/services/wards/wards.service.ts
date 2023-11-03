import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfigstateService } from '../configstate/configstate.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class WardsService {
    constructor(private http: HttpClient, private newConfig: ConfigstateService) { }

    public GetAllWards(): Observable<any> {
        return this.http.get(this.newConfig.state.config.root.dataUrl + 'ward').pipe(map(res => res));
    }

    public GetOneWard(WardName: string) {
        // Not used
        return this.http.get(this.newConfig.state.config.root.dataUrl + 'ward/name/' + WardName).pipe(map((res: any) => {
        return res;
        }));
    }

    public GetAllForms(): Observable<any> {
        return this.http.get(this.newConfig.state.config.root.dataUrl + 'ward').pipe(map(res => res));
    }

   public UpdateWard(wardData: any): Observable<any> {

       // delete wardData.displayName;

       const myUrl = this.newConfig.state.config.root.dataUrl + 'ward/update';


       return this.http.post(myUrl, JSON.stringify(wardData), httpOptions).pipe(
            map(res => {
                console.log('Got a response');
                console.log(res);
                return res;
            }),
            catchError(err => {
                console.log('caught mapping error and rethrowing', err);
                return throwError(err);
            })
        );
    }
}
