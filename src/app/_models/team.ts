  import { Player } from "./player";


  export class Team {
      teamId: string;
      name: string;
      location: string;
      coach: string;
      region: string;
      manager: string;
      players: Player[];
      teamPhotoUrl?: string;
    }
    