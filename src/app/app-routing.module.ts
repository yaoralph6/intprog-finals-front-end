import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

import { TournamentComponent } from './tournaments/tournaments.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const teamModule = () => import('./teams/team.module').then(x => x.TeamModule);
const playerModule = () => import('./players/player.module').then(x => x.PlayerModule);
const tournamentModule = () => import('./tournament/tournament.module').then(x => x.TournamentModule);
const scheduleModule = () => import('./schedule/schedule.module').then(x => x.ScheduleModule);


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'teams', loadChildren: teamModule },
    { path: 'players', loadChildren: playerModule },
    { path: 'tournaments', component: TournamentComponent, canActivate: [AuthGuard] },
    { path: 'tournament', loadChildren: tournamentModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },
    { path: 'schedule', loadChildren: scheduleModule, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
    
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }