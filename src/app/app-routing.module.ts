import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'pendencies', loadChildren: './pages/categories/categories.module#CategoriesModule'},
  { path: 'pieces', loadChildren: './pages/pieces/pieces.module#PiecesModule'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
