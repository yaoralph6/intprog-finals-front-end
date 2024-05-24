import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { ListComponent } from './list.component';
import { AddEditComponent } from './add-edit.component';
import { MapToRangePipe } from './map-to-range.pipe';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountsRoutingModule,
        FormsModule
    ],
    declarations: [
        ListComponent,
        AddEditComponent,
        MapToRangePipe
    ]
})
export class AccountsModule { }