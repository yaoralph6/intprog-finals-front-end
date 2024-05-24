import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamListComponent } from './list/list.component';
import { AddEditTeamComponent } from './add-edit/add-edit-team.component';
import { TeamProfileComponent } from './team-profile/team-profile.component';
import { PlayerProfileComponent } from '../players/player-profile/player-profile.component';

const routes: Routes = [
    { path: '', component: TeamListComponent },
    { path: 'add', component: AddEditTeamComponent },
    { path: 'edit/:teamId', component: AddEditTeamComponent },
    { path: 'profile/:teamId', component: TeamProfileComponent },
    { path: 'players/profile/:playerId', component: PlayerProfileComponent },
    { path: 'players/profile/:playerId', loadChildren: () => import('../players/player-profile/player-profile.component').then(m => m.PlayerProfileComponent) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TeamRoutingModule { }
