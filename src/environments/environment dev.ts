
import { KeycloakConfig } from 'keycloak-js';
const keycloakConfig: KeycloakConfig = {
  url: 'https://sso.tst.nhs.uk:8443/auth',
  realm: 'SIDeR',
  clientId: 'mms-app'
};

export const environment = {
  //mongoDBURL: '#https://formsauthapitest.tst.nhs.uk/mungo',
  //dataUrl: 'https://mph-mmsapi.tst.nhs.uk/api/',
  //dataUrl: 'https://mph-formsnewdev.tst.nhs.uk/api/',
  production: true,
  keycloak: keycloakConfig,
  appenv: 'PRD'
};