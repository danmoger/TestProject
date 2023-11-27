
import { KeycloakConfig } from 'keycloak-js';
const keycloakConfig: KeycloakConfig = {
  url: 'https://sft-sso-01.somersetft.nhs.uk:8443/auth',
  realm: 'TSTDEV',
  clientId: 'mms-app'
};

export const environment = {
  mongoDBURL: '#https://formsauthapitest.tst.nhs.uk/mungo',
  //dataUrl: 'https://mph-mmsapi.tst.nhs.uk/api/',
  dataUrl: 'https://mph-formsnewdev.tst.nhs.uk/',
  production: false,
  keycloak: keycloakConfig,
  appenv: '-dev'
};