import { Component, OnInit } from '@angular/core';
import { TeamService } from '../../_services/team.services';
import { Router } from '@angular/router';
import { Team } from '../../_models/team';
import { Role } from '../../_models';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class TeamListComponent implements OnInit {
  teams: Team[] = [];
  filteredTeams: Team[] = [];
  paginatedTeams: Team[] = [];
  searchText: string = '';
  isLoading: boolean = true;
  isAdmin: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(
    private teamService: TeamService,
    private router: Router,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.isAdmin = this.accountService.accountValue.role === Role.Admin;
    this.fetchTeams();
  }

  fetchTeams(): void {
    this.teamService.getAll().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.filteredTeams = teams;
        this.totalPages = Math.ceil(this.filteredTeams.length / this.pageSize);
        this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
        this.paginateTeams();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching teams', error);
        this.isLoading = false;
      }
    });
  }

  filterTeams(): void {
    this.filteredTeams = this.teams.filter(team =>
      team.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      team.location.toLowerCase().includes(this.searchText.toLowerCase()) ||
      team.coach?.toLowerCase().includes(this.searchText.toLowerCase()) ||  // Optional check for coach
      team.region.toLowerCase().includes(this.searchText.toLowerCase()) ||
      team.manager?.toLowerCase().includes(this.searchText.toLowerCase())   // Optional check for manager
    );
    this.totalPages = Math.ceil(this.filteredTeams.length / this.pageSize);
    this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
    this.currentPage = 1; // reset to first page
    this.paginateTeams();
  }

  paginateTeams(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTeams = this.filteredTeams.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginateTeams();
  }
/*
  deleteTeam(teamId: string) {
    this.teamService.delete(teamId).subscribe(() => {
      this.teams = this.teams.filter(team => team.teamId !== teamId);
      this.filterTeams();
    });
  }
*/
  viewTeam(teamId: string) {
    this.router.navigate(['/teams/profile', teamId]);
  }
}
