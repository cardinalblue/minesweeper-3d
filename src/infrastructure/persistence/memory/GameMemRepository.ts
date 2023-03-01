import GameAgg from "../../../domain/model/game_model/GameAgg.ts";
import GameRepository from "../../../domain/model/game_model/GameRepository.ts";

const gameMap: { [id: string]: GameAgg } = {};

export default class GameMemRepository implements GameRepository {
  get(id: string): GameAgg {
    return gameMap[id];
  }
  add(game: GameAgg): void {
    gameMap[game.getId()] = game;
  }
  update(game: GameAgg): void {
    gameMap[game.getId()] = game;
  }
}
