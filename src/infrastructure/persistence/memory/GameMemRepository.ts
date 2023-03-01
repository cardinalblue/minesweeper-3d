import { GameAgg } from "../../../domain/model/game_model/mod.ts";
import type { GameRepository } from "../../../domain/model/game_model/mod.ts";

const gameMap: { [id: string]: GameAgg } = {};

export default class GameMemRepository implements GameRepository {
  get(id: string): GameAgg {
    return gameMap[id];
  }
  getAll(): GameAgg[] {
    return Object.keys(gameMap).map((gameId) => gameMap[gameId]);
  }
  add(game: GameAgg): void {
    gameMap[game.getId()] = game;
  }
  update(game: GameAgg): void {
    gameMap[game.getId()] = game;
  }
}
