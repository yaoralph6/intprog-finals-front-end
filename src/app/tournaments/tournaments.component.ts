import { Component, OnInit } from '@angular/core';
import { DisplayTournamentService } from '../_services/display-tournament.service';
import { Schedule } from '../_models/schedule';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentComponent implements OnInit {
  showTables = false;
  showSchedule = false;

  selectedTournamentData: any[] = [];
  currentSchedule: Schedule[] = [];
  currentTournamentName: string = '';

  constructor(
    private displayTournamentService: DisplayTournamentService
  ) {}

  ngOnInit(): void {
    this.fetchTournamentData();
  }

  fetchScheduleData(tournamentId: number) {
    this.displayTournamentService.getScheduleByTournamentId(tournamentId).subscribe(
      (schedule: Schedule[]) => {
        console.log('Schedule data:', schedule); 
        this.currentSchedule = schedule;
        this.showSchedule = true;
      },
      (error) => {
        console.error('Error fetching schedule:', error);
      }
    );
  }

  fetchTournamentData() {
    this.displayTournamentService.getAllTournaments().subscribe(
      (data: any[]) => {
        this.selectedTournamentData = data;
      },
      (error) => {
        console.error('Error fetching tournament data:', error);
      }
    );
  }

  toggleTournamentData(game: string) {
    if (game) {
      if (this.selectedTournamentData && this.selectedTournamentData[0]?.game === game) {
        this.showTables = !this.showTables;
        return;
      }

      this.showTables = true;
      this.showSchedule = false; 

      switch (game) {
        case 'Dota 2':
          this.getTournamentData('Dota 2');
          break;
        case 'Valorant':
          this.getTournamentData('Valorant');
          break;
        case 'Mobile Legends':
          this.getTournamentData('Mobile Legends');
          break;
        default:
          this.showTables = false;
          this.selectedTournamentData = [];
      }
    }
  }

  getTournamentData(game: string) {
    this.displayTournamentService.getAllTournaments().subscribe(
      (data: any[]) => {
        this.selectedTournamentData = data.filter(tournament => tournament.game === game);
      },
      (error) => {
        console.error('Error fetching tournament data:', error);
      }
    );
  }

  toggleTournamentSchedule(tournamentId: number, tournamentName: string) {
    if (this.showSchedule && this.currentSchedule.length > 0 && this.currentTournamentName === tournamentName) {
      this.showSchedule = false;
      this.currentSchedule = [];
    } else {
      this.fetchScheduleData(tournamentId);
      this.currentTournamentName = tournamentName;
    }
  }
}
