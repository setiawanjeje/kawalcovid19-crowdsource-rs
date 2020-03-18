import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RsComponent } from './rs/rs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { VizComponent } from './viz/viz.component';
import { RsAddComponent } from './rs-add/rs-add.component';

const routes: Routes = [
  { path: 'rs/:id', component: RsComponent },
  { path: 'rs', component: RsAddComponent },
  { path: '', component: VizComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
