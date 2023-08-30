import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms/forms.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-weekly',
    templateUrl: './weekly.component.html',
    styleUrls: ['./weekly.component.css']
})
export class WeeklyComponent implements OnInit {

    ready = false;
    reportsList: any;

    constructor(private formsservice: FormsService, private router: Router) { }

    ngOnInit() {
        this.initialise();
    }

    initialise() {
        this.ready = false;
        this.getTodaysResusShortList();
    }

    getTodaysResusShortList() {
        this.formsservice.getTodaysResusShortList()
            .subscribe((res: any) => {this.reportsList = res
                .map((x:any) => {x.ward = x.ward.replace('Resus - ', ''); return x; })
                .sort((a:any, b:any) => a.ward.localeCompare(b.ward));
                                      this.ready = true; console.log(this.reportsList); });
    }

    BackToStart() {
        this.router.navigate(['survey']);
    }
}
