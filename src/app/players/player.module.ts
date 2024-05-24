import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { PlayerListComponent } from './list/list.component';
import { AddEditPlayerComponent } from './add-edit/add-edit-players.component';
import { PlayerProfileComponent } from './player-profile/player-profile.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PlayerRoutingModule,
        FormsModule
    ],
    declarations: [
        PlayerListComponent,
        AddEditPlayerComponent,
        PlayerProfileComponent
    ]
})
export class PlayerModule { }
