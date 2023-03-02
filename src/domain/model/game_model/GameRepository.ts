import GameAgg from "./GameAgg.ts";

export default interface GameRepository {
  get(id: string): GameAgg | null;
  getAll(): GameAgg[];
  add(game: GameAgg): void;
  update(game: GameAgg): void;
}
