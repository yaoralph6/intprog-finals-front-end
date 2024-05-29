import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Schedule } from '../_models/schedule';

const baseUrl = `${environment.apiUrl}/schedules`;
const tournamentsUrl = `${environment.apiUrl}/tournaments`;

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(baseUrl).pipe(
      switchMap(schedules => {
        const tournamentRequests = schedules.map(schedule =>
          this.http.get<any>(`${tournamentsUrl}/${schedule.tournamentId}`)
        );

        return forkJoin(tournamentRequests).pipe(
          map(tournaments => {
            return schedules.map((schedule, index) => ({
              ...schedule,
              tournamentName: tournaments[index].name
            }));
          })
        );
      })
    );
  }

  getById(scheduleId: string): Observable<Schedule> {
    return this.http.get<Schedule>(`${baseUrl}/${scheduleId}`);
  }

  create(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(baseUrl, schedule);
  }

  update(scheduleId: string, params: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`${baseUrl}/${scheduleId}`, params);
  }

  delete(scheduleId: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/${scheduleId}`);
  }

  // Fetch schedules by tournament ID
  getByTournamentId(tournamentId: string): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${baseUrl}/tournament/${tournamentId}`);
  }
}
