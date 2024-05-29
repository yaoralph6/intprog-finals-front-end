import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../_services/players.services';
import { TeamService } from '../../_services/team.services';
import { Router } from '@angular/router';
import { Player } from '../../_models/player';
import { forkJoin } from 'rxjs';
import { AccountService } from '../../_services/account.service';
import { Role } from '../../_models/role';



@Component({
  selector: 'app-player-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  filteredPlayers: Player[] = [];
  paginatedPlayers: Player[] = [];
  searchText: string = '';
  isLoading: boolean = true;
  isAdmin: boolean = false;

  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  pages: number[] = [];


  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.accountService.accountValue.role === Role.Admin;
    this.fetchPlayers();
  }
 

  fetchPlayers(): void {
    this.isLoading = true;
    this.playerService.getAll().subscribe({
      next: (players) => {
        this.players = players;
        this.filteredPlayers = players;
  
        // Get a list of unique team IDs
        const teamIds = [...new Set(players.map(player => player.teamId))];
  
        // Use forkJoin to make concurrent requests for teams
        forkJoin(teamIds.map(teamId => this.teamService.getById(teamId))).subscribe({
          next: (fetchedTeams) => {
            // Map fetched teams to a lookup object for easy access by ID
            const teamMap = fetchedTeams.reduce((acc, team) => {
              acc[team.teamId] = team.name;
              return acc;
            }, {});
  
            // Assign team names to players using the lookup object
            this.players.forEach(player => {
              player.teamDisplayName = teamMap[player.teamId];
            });
  
            this.filteredPlayers = this.players; // Update filtered players
            this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize);
            this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
            this.paginatePlayers();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching teams:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching players', error);
        this.isLoading = false;
      }
    });
  }
  
  

  filterPlayers(): void {
    this.filteredPlayers = this.players.filter(player =>
      player.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      player.nationality.toLowerCase().includes(this.searchText.toLowerCase()) ||
      player.region.toLowerCase().includes(this.searchText.toLowerCase()) ||
      player.role.toLowerCase().includes(this.searchText.toLowerCase()) ||
      player.ingameName.toLowerCase().includes(this.searchText.toLowerCase()) ||
      (player.team && player.team.name.toLowerCase().includes(this.searchText.toLowerCase()))
    );
    this.totalPages = Math.ceil(this.filteredPlayers.length / this.pageSize);
    this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
    this.currentPage = 1; // reset to first page
    this.paginatePlayers();
  }

  paginatePlayers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPlayers = this.filteredPlayers.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginatePlayers();
  }
/*
  deletePlayer(playerId: string): void {
    this.playerService.delete(playerId).subscribe({
      next: () => {
        this.players = this.players.filter(player => player.playerId !== playerId);
        this.filterPlayers();
      },
      error: (error) => {
        console.error('Error deleting player', error);
      }
    });
  }
*/
  viewPlayer(playerId: string): void {
    this.router.navigate(['/players/profile', playerId]);
  }

  viewTeam(teamId: string): void {
    this.router.navigate(['/teams/profile', teamId]);
  }
}
