import type { GameRepository } from "../../../domain/model/game_model/mod.ts";
import type { PlayerRepository } from "../../../domain/model/player_model/mod.ts";
import {
  GameAgg,
  PositionVo,
  SizeVo,
} from "../../../domain/model/game_model/mod.ts";
import type {
  GameUpdatedResponseDto,
  PlayersUpdatedResponseDto,
} from "./responseDto.ts";
import { ResponseDtoType } from "./responseDto.ts";
import { newGameAggDto, newPlayerAggDto } from "../../dto/mod.ts";
import type { GameAggDto } from "../../dto/mod.ts";
import type Presenter from "./Presenter.ts";

export default class Service {
  private gameRepository: GameRepository;
  private playerRepository: PlayerRepository;

  constructor(
    gameRepository: GameRepository,
    playerRepository: PlayerRepository,
  ) {
    this.gameRepository = gameRepository;
    this.playerRepository = playerRepository;
  }

  public queryGame(presenter: Presenter, gameId: string) {
    const game = this.gameRepository.get(gameId);
    if (!game) {
      return;
    }

    const gameDto = newGameAggDto(game);
    const response: GameUpdatedResponseDto = {
      type: ResponseDtoType.GameUpdated,
      game: gameDto,
    };
    presenter.onMessage(JSON.stringify(response));
  }

  public queryPlayers(
    presenter: Presenter,
    gameId: string,
  ) {
    const players = this.playerRepository.getAll(gameId);
    const response: PlayersUpdatedResponseDto = {
      type: ResponseDtoType.PlayersUpdated,
      players: players.map(newPlayerAggDto),
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

  public revealArea(gameId: string, x: number, z: number) {
    const game = this.gameRepository.get(gameId);
    if (!game) {
      return;
    }

    const pos = new PositionVo(x, z);
    game.revealArea(pos);
    this.gameRepository.add(game);
  }

  public flagArea(gameId: string, x: number, z: number) {
    const game = this.gameRepository.get(gameId);
    if (!game) {
      return;
    }
    const pos = new PositionVo(x, z);
    game.flagArea(pos);
    this.gameRepository.add(game);
  }
}
