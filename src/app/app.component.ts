import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
<mat-toolbar>
  <div class="header">
    <img src="../assets/Kawalcovid19@3x.png" />
    Crowdsource dari RS
  </div>
</mat-toolbar>
<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
