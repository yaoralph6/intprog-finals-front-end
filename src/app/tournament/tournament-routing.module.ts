import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentListComponent } from './list/list-tournament.component';
import { AddEditTournamentComponent } from './add-edit/add-edit-tournament.component';


const routes: Routes = [
  { path: '', component: TournamentListComponent },
  { path: 'add', component: AddEditTournamentComponent },
  { path: 'edit/:tournamentId', component: AddEditTournamentComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule { }