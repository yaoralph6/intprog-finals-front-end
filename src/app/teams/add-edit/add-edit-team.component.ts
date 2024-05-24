import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../../_services';
import { TeamService } from '../../_services/team.services';
import { Team } from '../../_models/team';

@Component({ templateUrl: 'add-edit-team.component.html' })
export class AddEditTeamComponent implements OnInit {
    form: FormGroup;
    teamId: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private teamService: TeamService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.teamId = this.route.snapshot.params['teamId'];
        this.isAddMode = !this.teamId;

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            location: ['', Validators.required],
            coach: ['', Validators.required],
            region: ['', Validators.required],
            manager: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.teamService.getById(this.teamId)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createTeam();
        } else {
            this.updateTeam();
        }
    }

    private createTeam() {
        this.teamService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Team created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateTeam() {
        this.teamService.update(this.teamId, this.form.value)
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
