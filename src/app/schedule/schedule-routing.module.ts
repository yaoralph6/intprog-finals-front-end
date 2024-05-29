import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListScheduleComponent } from './list/list-schedule.component';
import { AddEditScheduleComponent } from './add-edit/add-edit-schedule.component';


const routes: Routes = [
  { path: '', component: ListScheduleComponent },
  { path: 'add', component: AddEditScheduleComponent },
  { path: 'edit/:scheduleId', component: AddEditScheduleComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }