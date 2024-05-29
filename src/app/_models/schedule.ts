import { Tournament } from './tournament';

export interface Schedule {
  id: number;
  date: string;
  match: string;
  teams: string;
  result: string;
  tournamentId: number;
  tournamentName?: string; 
}