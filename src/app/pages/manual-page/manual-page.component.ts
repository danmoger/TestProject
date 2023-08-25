import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-manual-page',
  templateUrl: './manual-page.component.html',
  styleUrls: ['./manual-page.component.css']
})
export class ManualPageComponent {
  pdfSrc = '../../assets/mmsresus V3.pdf';

  constructor(private router: Router) { }

  BackToStart() {
    this.router.navigate(['survey']);
  }
}
