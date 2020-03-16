import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
<mat-toolbar color="primary">
  <span>KawalCovid19 untuk Rumah Sakit</span>
</mat-toolbar>  
<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
