import { Component, OnInit } from '@angular/core';
import { TournamentService } from '../../_services/tournament.service';
import { Router } from '@angular/router';
import { Tournament } from '../../_models/tournament';

@Component({
  selector: 'app-tournament-list',
  templateUrl: './list-tournament.component.html',
  styleUrls: ['./list-tournament.component.css']
})
export class TournamentListComponent implements OnInit {
  tournaments: Tournament[] = [];
  filteredTournaments: Tournament[] = [];
  paginatedTournaments: Tournament[] = [];
  searchText: string = '';
  isLoading: boolean = true;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(
    private tournamentService: TournamentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchTournaments();
  }

  fetchTournaments(): void {
    this.tournamentService.getAll().subscribe({
      next: (tournaments) => {
        this.tournaments = tournaments;
        this.filteredTournaments = tournaments;
        this.totalPages = Math.ceil(this.filteredTournaments.length / this.pageSize);
        this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
        this.paginateTournaments();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching tournaments', error);
        this.isLoading = false;
      }
    });
  }

  filterTournaments(): void {
    this.filteredTournaments = this.tournaments.filter(tournament =>
      tournament.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      tournament.location.toLowerCase().includes(this.searchText.toLowerCase()) ||
      tournament.game.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredTournaments.length / this.pageSize);
    this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
    this.currentPage = 1; // reset to first page
    this.paginateTournaments();
  }

  paginateTournaments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTournaments = this.filteredTournaments.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginateTournaments();
  }

/*
  deleteTournament(tournamentId: string)  {
    this.tournamentService.delete(tournamentId).subscribe({
      next: () => {
        // Convert tournamentId to a number for comparison
        const tournamentIdNumber = Number(tournamentId);
        if (isNaN(tournamentIdNumber)) {
          console.error('Invalid tournamentId:', tournamentId);
          return;
        }
        
        this.tournaments = this.tournaments.filter(tournament => tournament.tournamentId !== tournamentId);
        this.filterTournaments();
      },
      error: (error) => {
        console.error('Error deleting tournament', error);
      }
    });
  }
*/
}