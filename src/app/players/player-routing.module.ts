import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerListComponent } from './list/list.component';
import { AddEditPlayerComponent } from './add-edit/add-edit-players.component';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { AuthGuard } from '../_helpers';

const routes: Routes = [
    { path: '', component: PlayerListComponent },
    { path: 'add', component: AddEditPlayerComponent},
    { path: 'edit/:playerId', component: AddEditPlayerComponent },
    { path: 'profile/:playerId', component: PlayerProfileComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerRoutingModule { }
