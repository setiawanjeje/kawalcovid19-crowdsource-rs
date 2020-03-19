import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RsComponent } from './rs/rs.component';
import { VizComponent } from './viz/viz.component';
import { RsAddComponent } from './rs-add/rs-add.component';

const routes: Routes = [
  { path: 'rs/:id', component: RsComponent },
  { path: 'rs', component: RsAddComponent },
  { path: 'viz/:id', component: VizComponent },
  { path: '**', redirectTo: '/viz/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
