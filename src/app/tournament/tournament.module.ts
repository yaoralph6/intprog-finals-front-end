import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TournamentRoutingModule } from './tournament-routing.module';
import { TournamentListComponent } from './list/list-tournament.component';
import { AddEditTournamentComponent } from './add-edit/add-edit-tournament.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TournamentRoutingModule,
    FormsModule
  ],
  declarations: [
    TournamentListComponent,
    AddEditTournamentComponent,

  ]
})
export class TournamentModule { }