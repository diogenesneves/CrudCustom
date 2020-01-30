import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PieceListComponent } from './piece-list/piece-list.component';
import { PieceFormComponent } from './piece-form/piece-form.component';


const routes: Routes = [
  { path: '', component: PieceListComponent},
  { path: 'new', component: PieceFormComponent},
  { path: ':id/edit', component: PieceFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PiecesRoutingModule { }
