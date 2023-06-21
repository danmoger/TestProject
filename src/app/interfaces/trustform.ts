export interface ITrustForm {
    'showHeader': boolean;
    'useRoles': boolean;
    'name': string;
    'form': any;
    'database': {
        'dbname': string,
        'collection': string
    };
    'version': {
        '$numberDecimal': string
    };
}