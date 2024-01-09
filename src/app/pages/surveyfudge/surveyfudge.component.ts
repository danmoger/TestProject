import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-surveyfudge',
  templateUrl: './surveyfudge.component.html',
  styleUrls: ['./surveyfudge.component.css']
})
export class SurveyfudgeComponent {
  constructor(private router: Router) {
    this.router.navigate(['survey']);
  }

}
