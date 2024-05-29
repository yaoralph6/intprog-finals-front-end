import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { ListScheduleComponent } from './list/list-schedule.component';
import { AddEditScheduleComponent } from './add-edit/add-edit-schedule.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScheduleRoutingModule,  
    FormsModule
  ],
  declarations: [
    ListScheduleComponent,
    AddEditScheduleComponent,

  ]
})
export class ScheduleModule { }
