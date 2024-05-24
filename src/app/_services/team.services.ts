import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Team } from '../_models/team';
import { Player } from '../_models/player';
import { forkJoin } from 'rxjs';

const baseUrl = `${environment.apiUrl}/teams`;

@Injectable({ providedIn: 'root' })
export class TeamService {
    private teamSubject: BehaviorSubject<Team>;
    public team: Observable<Team>;

    constructor(private http: HttpClient) {
        this.teamSubject = new BehaviorSubject<Team>(null);
        this.team = this.teamSubject.asObservable();
    }

    public get teamValue(): Team {
        return this.teamSubject.value;
    }

    getAll(): Observable<Team[]> {
        return this.http.get<Team[]>(baseUrl);
    }

    getById(teamId: string): Observable<Team> {
        return this.http.get<Team>(`${baseUrl}/${teamId}`)
            .pipe(map(team => {
                this.teamSubject.next(team);
                return team;
            }));
    }

    getByIds(teamIds: string[]): Observable<Team[]> {
        const requests = teamIds.map(teamId => this.getById(teamId));
        return forkJoin(requests); 
      }
    create(team: Team): Observable<Team> {
        return this.http.post<Team>(baseUrl, team);
    }

    update(teamId: string, params: Team): Observable<Team> {
        return this.http.put<Team>(`${baseUrl}/${teamId}`, params)
            .pipe(map((team: any) => {
                // update the current team if it was updated
                if (team.teamId === this.teamValue?.teamId) {
                    // publish updated team to subscribers
                    team = { ...this.teamValue, ...team };
                    this.teamSubject.next(team);
                }
                return team;
            }));
    }

    delete(teamId: string): Observable<void> {
        return this.http.delete<void>(`${baseUrl}/${teamId}`)
            .pipe(finalize(() => {
                // auto clear the current team if the logged-in team was deleted
                if (teamId === this.teamValue?.teamId) {
                    this.teamSubject.next(null);
                }
            }));
    }

    getPlayersByTeamId(id: string): Observable<Player[]> {
        return this.http.get<Player[]>(`${baseUrl}/${id}/players`);
    }
}
