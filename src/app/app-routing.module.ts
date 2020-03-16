import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RsComponent } from './rs/rs.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { VizComponent } from './viz/viz.component';

const routes: Routes = [
  { path: 'rs/:id', component: RsComponent },
  { path: 'rs', redirectTo: 'rs/', pathMatch: 'full' },
  { path: '', component: VizComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
