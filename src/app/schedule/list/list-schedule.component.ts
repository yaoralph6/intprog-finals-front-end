import { Component, OnInit } from '@angular/core';
import { Schedule } from '../../_models/schedule';
import { ScheduleService } from '../../_services/schedule.service';

@Component({
  selector: 'app-list-schedule',
  templateUrl: './list-schedule.component.html',
  styleUrls: ['./list-schedule.component.css']
})
export class ListScheduleComponent implements OnInit {
  schedules: Schedule[] = [];
  filteredSchedules: Schedule[] = [];
  paginatedSchedules: Schedule[] = [];
  searchText: string = '';
  isLoading: boolean = true;

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.fetchSchedules();
  }

  fetchSchedules(): void {
    this.scheduleService.getAll().subscribe({
      next: (schedules) => {
        this.schedules = schedules;
        this.filteredSchedules = schedules;
        this.totalPages = Math.ceil(this.filteredSchedules.length / this.pageSize);
        this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
        this.paginateSchedules();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching schedules', error);
        this.isLoading = false;
      }
    });
  }

  filterSchedules(): void {
    this.filteredSchedules = this.schedules.filter(schedule =>
      schedule.date.toLowerCase().includes(this.searchText.toLowerCase()) ||
      schedule.match.toLowerCase().includes(this.searchText.toLowerCase()) ||
      schedule.teams.toLowerCase().includes(this.searchText.toLowerCase()) ||
      schedule.result.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredSchedules.length / this.pageSize);
    this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1);
    this.currentPage = 1; // reset to first page
    this.paginateSchedules();
  }

  paginateSchedules(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedSchedules = this.filteredSchedules.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginateSchedules();
  }
/*
  deleteSchedule(id: string) {
    this.scheduleService.delete(id).subscribe(() => {
      this.schedules = this.schedules.filter(schedule => schedule.id !== Number(id)); // Convert id to number
      this.filterSchedules();
    });
  }
}*/
}