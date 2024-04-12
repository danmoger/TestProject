
import { KeycloakConfig } from 'keycloak-js';
const keycloakConfig: KeycloakConfig = {
  url: 'https://mph-eprdwhdkey2.tst.nhs.uk/auth',
  realm: 'SIDeR',
  clientId: 'mms-app'
};

export const environment = {
  //mongoDBURL: '#https://formsauthapitest.tst.nhs.uk/mungo',
  dataUrl: 'https://mph-devmmsapi.tst.nhs.uk/api/',
  //dataUrl: 'https://mph-formsnewdev.tst.nhs.uk/api/',
  production: true,
  keycloak: keycloakConfig,
  appenv: 'DEV'
};