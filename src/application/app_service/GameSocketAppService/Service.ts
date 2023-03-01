import type { GameRepository } from "../../../domain/model/game_model/mod.ts";
import {
  GameAgg,
  PositionVo,
  SizeVo,
} from "../../../domain/model/game_model/mod.ts";
import type { GameUpdatedResponseDto } from "./responseDto.ts";
import { ResponseDtoType } from "./responseDto.ts";
import { newGameAggDto } from "../../dto/mod.ts";
import type { GameAggDto } from "../../dto/mod.ts";
import type Presenter from "./Presenter.ts";

export default class Service {
  private gameRepository: GameRepository;
  constructor(gameRepository: GameRepository) {
    this.gameRepository = gameRepository;
  }

  public queryGame(presenter: Presenter, id: string) {
    const game = this.gameRepository.get(id);
    const gameDto = newGameAggDto(game);
    const response: GameUpdatedResponseDto = {
      type: ResponseDtoType.GameUpdated,
      game: gameDto,
    };
    presenter.onMessage(JSON.stringify(response));
  }

  public createGame(): GameAggDto {
    const newGame = new GameAgg(
      crypto.randomUUID(),
      new SizeVo(10, 10),
      50,
    );
    this.gameRepository.add(newGame);
    return newGameAggDto(newGame);
  }

  public revealArea(id: string, x: number, z: number) {
    const pos = new PositionVo(x, z);
    const game = this.gameRepository.get(id);
    game.revealArea(pos);
    this.gameRepository.add(game);
  }

  public flagArea(id: string, x: number, z: number) {
    const pos = new PositionVo(x, z);
    const game = this.gameRepository.get(id);
    game.flagArea(pos);
    this.gameRepository.add(game);
  }
}
