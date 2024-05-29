import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Tournament } from '../_models/tournament';

const baseUrl = `${environment.apiUrl}/tournaments`;

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private tournamentSubject: BehaviorSubject<Tournament | null>;  // Allow null
  public tournament: Observable<Tournament | null>;

  constructor(private http: HttpClient) {
    this.tournamentSubject = new BehaviorSubject<Tournament | null>(null);  // Initialize with null
    this.tournament = this.tournamentSubject.asObservable();
  }

  public get tournamentValue(): Tournament | null {
    return this.tournamentSubject.value;
  }

  getAll(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(baseUrl);
  }

  getById(tournamentId: string): Observable<Tournament> {
    return this.http.get<Tournament>(`${baseUrl}/${tournamentId}`)
      .pipe(
        map(tournament => {
          this.tournamentSubject.next(tournament);
          return tournament;
        })
      );
  }

  create(tournament: Tournament): Observable<Tournament> {
    return this.http.post<Tournament>(baseUrl, tournament);
  }

  update(tournamentId: string, params: Tournament): Observable<Tournament> {
    return this.http.put<Tournament>(`${baseUrl}/${tournamentId}`, params)
      .pipe(
        map((tournament: any) => {
          // update the current tournament if it was updated
          if (tournament.id === this.tournamentValue?.id) {
            // publish updated tournament to subscribers
            tournament = { ...this.tournamentValue, ...tournament };
            this.tournamentSubject.next(tournament);
          }
          return tournament;
        })
      );
  }

  delete(tournamentId: string): Observable<void> {
    return this.http.delete<void>(`${baseUrl}/${tournamentId}`)
      .pipe(
        finalize(() => {
          if (this.tournamentValue && tournamentId === this.tournamentValue.id.toString()) {
            this.tournamentSubject.next(null);
          }
        })
      );
    }
  }