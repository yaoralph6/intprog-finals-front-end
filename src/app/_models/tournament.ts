export enum Game {
  Dota2 = 'Dota 2',
  Valorant = 'Valorant',
  MobileLegends = 'Mobile Legends'
}

export interface Tournament {
  tournamentId: string;
  id: number;
  name: string;
  date: string;
  prize_pool: string;
  location: string;
  winner: string;
  runner_up: string;
  game: string; 
}