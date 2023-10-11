import { KeycloakService } from 'keycloak-angular';
import { KeycloakConfig } from 'keycloak-js';
import { environment } from '../environments/environment';
import { ConfigstateService } from 'src/app/services/configstate/configstate.service';
import { HttpClient } from '@angular/common/http';
import { FormsService } from 'src/app/services/forms/forms.service';
import { isDevMode, enableProdMode } from '@angular/core';


function getQueryParameter(key: string): string {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get(key);
}

export function initializer(forms: FormsService, http: HttpClient, keycloak: KeycloakService,
    appConfig: ConfigstateService): () => Promise<any> {
    let formDetail = '';
    let kcConfig: KeycloakConfig = null;
    let myFormName = getQueryParameter('FormName'); // mmsResus
    console.log('Starting.....');

    let myRes = null;
    return (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {

                const promise1 = new Promise((resolve1, reject1) => {

                    console.log('ready to Go ');
                    http.get('/assets/data/appConfig.json').toPromise().then((res: any) => {
                        myRes = res;
                        console.log(myRes);
                        if (myRes.root.devMode === false) {
                            enableProdMode();
                            console.log('Prod mode Enabled');
                        }
                        if (myFormName === null) {
                            myFormName = myRes.root.default;
                        } 
                        myRes.root.isAppMode = true;        

                        kcConfig = environment.keycloak;
                        kcConfig.clientId = 'forms-app';
                        if (isDevMode()) {
                            // kcConfig.url = myRes.root.keyCloakUrl;
                            console.log('In DevMode');
                            console.log(environment);
                        }

                        if (myFormName != null) {
                            myRes.root.formname = myFormName;
                        }
                        console.log(myRes);
                        appConfig.loadAppConfig(myRes).toPromise()
                            .then(data => { console.log('====================Appconfig loaded: ', data); });

                        resolve1('Wahoo');
                    });
                });
                // console.log( 'Ready for a promise?' );
                const a = await promise1; // ToDo is const a needed?
                // console.log( JSON.stringify( appConfig.state, null, 2 ) );
                console.log('starting KeyCloak initialisation');
                await keycloak.init({
                    config: kcConfig,
                    initOptions: {
                        onLoad: 'login-required',
                        checkLoginIframe: false
                    },
                    bearerExcludedUrls: ['/assets'],
                    loadUserProfileAtStartUp: false
                })

                console.log('init');
                const kk = keycloak.getKeycloakInstance();
                console.log(JSON.stringify(kk.tokenParsed, null, 2));
                const promise2 = new Promise((resolve1, reject1) => {
                    if (myRes.root.isAppMode === true) {
                        forms.getForm(myFormName).toPromise().then((resp) => {
                            formDetail = resp;
                            myRes.root.data.formDetail = formDetail;
                            console.log(myRes);
                            resolve1('Wahoo');
                        });
                    } else {
                        resolve1('Wahoo');
                    }
                });

                const b = await promise2;
                console.log('Resolved 2');

                myRes.root.data.Token = kk.tokenParsed;

                myRes.root.hasResus = false;
                myRes.root.hasMMS = false;

                appConfig.updateState({ config: myRes }, 'init 129');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };
}
