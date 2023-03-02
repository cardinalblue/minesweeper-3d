import PlayerAgg from "./PlayerAgg.ts";

export default interface PlayerRepository {
  get(playerId: string): PlayerAgg | null;
  getAll(gameId: string): PlayerAgg[];
  add(player: PlayerAgg): void;
}
