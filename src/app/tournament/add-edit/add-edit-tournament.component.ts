import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from '../../_services';
import { TournamentService } from '../../_services/tournament.service';
import { Tournament } from '../../_models/tournament';

@Component({ templateUrl: 'add-edit-tournament.component.html' })
export class AddEditTournamentComponent implements OnInit {
    form: FormGroup;
    tournamentId: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private tournamentService: TournamentService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.tournamentId = this.route.snapshot.params['tournamentId'];
        this.isAddMode = !this.tournamentId;

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            date: ['', Validators.required],
            prize_pool: ['', Validators.required],
            location: ['', Validators.required],
            winner: ['', Validators.required],
            runner_up: ['', Validators.required],
            game: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.tournamentService.getById(this.tournamentId)
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
            this.createTournament();
        } else {
            this.updateTournament();
        }
    }

    private createTournament() {
        this.tournamentService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Tournament created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateTournament() {
        this.tournamentService.update(this.tournamentId, this.form.value)
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
