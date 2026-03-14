export type TeamIndex = 0 | 1;

export type GameFormat = 501 | 1001;

export interface RoundDeclarations {
  tierces: number;
  poltinas: number;
  hasBela: boolean;
}

export interface Round {
  id: string;
  playedBy: TeamIndex;
  declarations: RoundDeclarations;
  pool: number;
  rawPoints: [number, number];
  finalScores: [number, number];
  isBait: boolean;
  isDraw: boolean;
  noTricks: [boolean, boolean];
  carryOverApplied: number;
  timestamp: number;
}

export interface GameState {
  teamNames: [string, string];
  gameFormat: GameFormat;
  rounds: Round[];
  carryOver: number;
  isActive: boolean;
}

export interface RoundFormState {
  playedBy: TeamIndex;
  declarations: RoundDeclarations;
  rawPoints: [number | null, number | null];
  noTricks: [boolean, boolean];
}
