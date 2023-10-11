
import { KeycloakConfig } from 'keycloak-js';
const keycloakConfig: KeycloakConfig = {
  url: 'https://sso.tst.nhs.uk/auth',
  realm: 'SIDER',
  clientId: 'forms-app'
};

export const environment = {
  //mongoDBURL: '#https://formsauthapitest.tst.nhs.uk/mungo',
  //dataUrl: 'https://mph-mmsapi.tst.nhs.uk/api/',
  //dataUrl: 'hhttps://trainingEval-api.tst.nhs.uk',
  production: false,
  keycloak: keycloakConfig,
  appenv: 'Argh'
};