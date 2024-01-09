import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-manual-page',
  templateUrl: './manual-page.component.html',
  styleUrls: ['./manual-page.component.css']
})
export class ManualPageComponent {

  pdfSrc = '../../assets/mmsresus latest.pdf';

  constructor(private router: Router, private route: ActivatedRoute) {

   }

  BackToStart() {
    this.router.navigate(['survey']);
  }
}
