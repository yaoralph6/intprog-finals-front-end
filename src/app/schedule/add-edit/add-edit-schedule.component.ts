import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../../_services';
import { ScheduleService } from '../../_services/schedule.service';
import { TournamentService } from '../../_services/tournament.service';
import { Tournament } from '../../_models/tournament';
import { Schedule } from '../../_models/schedule';

@Component({templateUrl: 'add-edit-schedule.component.html'})
export class AddEditScheduleComponent implements OnInit {
  form: FormGroup;
  scheduleId: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  tournaments: Tournament[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService,
    private tournamentService: TournamentService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.scheduleId = this.route.snapshot.params['scheduleId'];
    this.isAddMode = !this.scheduleId;

    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      match: ['', Validators.required],
      teams: ['', Validators.required],
      result: ['', Validators.required],
      tournamentId: ['', Validators.required]
    });

    this.loadTournaments();

    if (!this.isAddMode) {
      this.scheduleService.getById(this.scheduleId)
        .pipe(first())
        .subscribe(x => this.form.patchValue(x));
    }
  }

  private loadTournaments() {
    this.tournamentService.getAll()
      .pipe(first())
      .subscribe(tournaments => this.tournaments = tournaments);
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.form.invalid) {
      return;
    }

    this.form.patchValue({
      tournamentId: this.form.value.tournamentId 
    });

    this.loading = true;
    if (this.isAddMode) {
      this.createSchedule();
    } else {
      this.updateSchedule();
      
    }
  }

  

  private createSchedule() {
    this.scheduleService.create({ ...this.form.value, tournamentId: this.form.value.tournamentId })
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Schedule created successfully', { keepAfterRouteChange: true });
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

  private updateSchedule() {
    this.scheduleService.update(this.scheduleId, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
