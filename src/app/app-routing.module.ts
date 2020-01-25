import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluationComponent } from './components/evaluation/evaluation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/evaluation',
    pathMatch: 'full'
  },
  {
    path: 'evaluation',
    component: EvaluationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
