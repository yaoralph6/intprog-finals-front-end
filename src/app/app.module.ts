import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AccountService } from './_services';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';

import { TournamentComponent } from './tournaments/tournaments.component';
import { TeamModule } from './teams/team.module';
import { PlayerModule } from './players/player.module';
import { TournamentModule } from './tournament/tournament.module';
import { ScheduleModule } from './schedule/schedule.module';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        TeamModule,
        PlayerModule,
        TournamentModule,
        ScheduleModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        TournamentComponent
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        
        // provider used to create fake backend
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }