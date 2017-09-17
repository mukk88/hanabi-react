export interface ICardData {
  Suit: number;
  Number: number;
  SuitRevealed: Boolean;
  NumberRevealed: Boolean;
}

export interface IPlayerData {
  Name: string;
  Token: string;
  Index: number;
  HandSize: number;
  Cards: ICardData[];
}