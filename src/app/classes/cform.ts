import { Component } from '@angular/core';
import { ITrustForm } from 'src/app/interfaces/trustform';


export class FormClass implements ITrustForm {

    showHeader: boolean;
    useRoles: boolean;
    name: string;
    form: any = {
        'title': 'blank',
        'pages': [
            {
                'name': 'first'
            }
        ],
        'showPrevButton': false,
        'showPageTitles': false,
        'showCompletedPage': false,
        'showQuestionNumbers': 'off',
        'questionErrorLocation': 'bottom',
        'completeText': 'Save',
        'questionsOnPageMode': 'singlePage'
    };
    database: {
        dbname: string,
        collection: string
    };
    version: {
        $numberDecimal: string;
    };
    constructor() {
        this.showHeader = false;
        this.useRoles = false;
        this.version = { '$numberDecimal': '0.1' };
    }
}