
import { KeycloakConfig } from 'keycloak-js';
const keycloakConfig: KeycloakConfig = {
  url: 'https://ssouat.tst.nhs.uk:8443/auth',
  realm: 'SIDeR',
  clientId: 'mms-app-uat'
};

export const environment = {
  mongoDBURL: '#https://formsauthapitest.tst.nhs.uk/mungo',
  dataUrl: 'https://mph-mmsapi.tst.nhs.uk/api/',
  //dataUrl: 'https://mph-formsnewdev.tst.nhs.uk/',
  production: false,
  keycloak: keycloakConfig,
  appenv: '-uat'
};