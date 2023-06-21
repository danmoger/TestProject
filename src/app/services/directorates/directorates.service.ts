import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DirectoratesService {
    constructor(private http: HttpClient) { }

    public GetAllDirectorates(): Observable<any> {
        return this.http.get(environment.dataUrl + 'directorate').pipe(map(res => res));
    }
}
