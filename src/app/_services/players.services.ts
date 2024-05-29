import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Player } from '../_models/player';

const baseUrl = `${environment.apiUrl}/players`;

@Injectable({ providedIn: 'root' })
export class PlayerService {
    private playerSubject: BehaviorSubject<Player>;
    public player: Observable<Player>;

    constructor(private http: HttpClient) {
        this.playerSubject = new BehaviorSubject<Player>(null);
        this.player = this.playerSubject.asObservable();
    }

    public get playerValue(): Player {
        return this.playerSubject.value;
    }

    getAll(): Observable<Player[]> {
        return this.http.get<Player[]>(baseUrl);
    }

    getById(playerId: string): Observable<Player> {
        return this.http.get<Player>(`${baseUrl}/${playerId}`)
            .pipe(map(player => {
                this.playerSubject.next(player);
                return player;
            }));
    }

    create(player: Player): Observable<Player> {
        return this.http.post<Player>(baseUrl, player);
    }

    update(playerId: string, params: Player): Observable<Player> {
        return this.http.put<Player>(`${baseUrl}/${playerId}`, params)
            .pipe(map((player: any) => {
                // update the current player if it was updated
                if (player.playerId === this.playerValue?.playerId) {
                    // publish updated player to subscribers
                    player = { ...this.playerValue, ...player };
                    this.playerSubject.next(player);
                }
                return player;
            }));
    }
    
    delete(playerId: string): Observable<void> {
        return this.http.delete<void>(`${baseUrl}/${playerId}`)
            .pipe(finalize(() => {
                // auto clear the current player if the logged-in player was deleted
                if (playerId === this.playerValue?.playerId) {
                    this.playerSubject.next(null);
                }
            }));
    }
}

