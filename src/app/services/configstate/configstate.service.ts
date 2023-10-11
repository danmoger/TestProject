import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from 'rxjs-observable-store';
import { ConfigstateSState } from './configstatesstate';


@Injectable({
  providedIn: 'root'
})
export class ConfigstateService extends Store<ConfigstateSState> {

  public ready$: Observable<any>;

  constructor() {
    // console.log( 'State constructor called' );
    super(new ConfigstateSState());



    // console.log( 'state constructure finished', JSON.stringify( this.state, null, 2 ) );
  }

  public loadAppConfig(datat: any): Observable<any> {
    // console.log( 'loadAppConfig running!', JSON.stringify( datat, null, 2 ) );
    this.ready$ = new Observable(observer => {
      const data = datat;
      observer.next(data);
      observer.complete();



      this.setState({
        ...this.state,
        config: data
      });
    });
    return this.ready$;
  }



  public updateValue(field: string, val: any, msg: string) {
    // console.log( 'Update one value called', field, val, msg );
    const myState = this.state;

    (myState.config.root as any)[field] = val;
    myState.config.root.data['msg'] = msg;
    this.setState({
      ...this.state,
      config: myState.config
    });
    // console.log( 'New value after single ', msg, JSON.stringify( this.state, null, 2 ) );
  }




  public updateState(nextState: ConfigstateSState, msg: string = '') {
    console.log('Update State called from ', msg);

    nextState.config.root.showHeader = false;
    this.setState({
      ...this.state,
      // config: nextState.config
    });
    console.log('State updated from to ', msg, JSON.stringify(this.state, null, 2));
  }
}