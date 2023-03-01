import GameRepository from "../../domain/model/game_model/GameRepository.ts";
import GameAgg from "../../domain/model/game_model/GameAgg.ts";
import PositionVo from "../../domain/model/game_model/PositionVo.ts";
import SizeVo from "../../domain/model/game_model/SizeVo.ts";

export default class GameService {
  private gameRepository: GameRepository;
  constructor(gameRepository: GameRepository) {
    this.gameRepository = gameRepository;
  }

  public createGame(id: string) {
    const newGame = new GameAgg(
      id,
      new SizeVo(10, 10),
      50,
    );
    this.gameRepository.add(newGame);
  }

  public revealArea(id: string, pos: PositionVo) {
    const game = this.gameRepository.get(id);
    game.revealArea(pos);
    this.gameRepository.add(game);
  }
}
