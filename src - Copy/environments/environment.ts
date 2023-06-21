
import { KeycloakConfig } from 'keycloak-js';
const keycloakConfig: KeycloakConfig = {
  url: 'https://sso.tst.nhs.uk/auth',
  // url: 'https://mph-eprdwhdkey1.tst.nhs.uk/auth',
  realm: 'TST',
  clientId: 'mms-app'
};


export const environment = {
  mongoDBURL: 'https://formsauthapitest.tst.nhs.uk/mungo',
  dataUrl: 'https://ResusapiTest.tst.nhs.uk/api/',
  production: false,
  keycloak: keycloakConfig,
  appenv: 'Argh'
};