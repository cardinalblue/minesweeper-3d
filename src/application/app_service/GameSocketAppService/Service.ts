import type { GameRepository } from "../../../domain/model/game_model/mod.ts";
import {
  DirectionVo,
  PlayerAgg,
} from "../../../domain/model/player_model/mod.ts";
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

  public createPlayer(
    playerId: string,
    gameId: string,
    name: string,
  ) {
    const newPlayer = new PlayerAgg(
      playerId,
      gameId,
      name,
      new PositionVo(0, 0),
      new DirectionVo(0),
    );
    this.playerRepository.add(newPlayer);
  }

  public removePlayer(
    playerId: string,
  ) {
    this.playerRepository.delete(playerId);
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

  public movePlayer(gameId: string, playerId: string, directionDto: number) {
    const game = this.gameRepository.get(gameId);
    if (!game) {
      return;
    }

    const player = this.playerRepository.get(playerId);
    if (!player) {
      return;
    }

    const direction = new DirectionVo(directionDto);

    let newPos = player.getPosition();
    switch (direction.toNumber()) {
      case 0:
        newPos = newPos.shift(0, -1);
        break;
      case 1:
        newPos = newPos.shift(1, 0);
        break;
      case 2:
        newPos = newPos.shift(0, 1);
        break;
      case 3:
        newPos = newPos.shift(-1, 0);
        break;
    }

    if (!game.getSize().includePos(newPos)) {
      return;
    }

    player.setPosition(newPos);
    this.playerRepository.update(player);
  }

  public revealArea(gameId: string, playerId: string) {
    const game = this.gameRepository.get(gameId);
    if (!game) {
      return;
    }

    const player = this.playerRepository.get(playerId);
    if (!player) {
      return;
    }

    game.revealArea(player.getPosition());
    this.gameRepository.add(game);
  }

  public flagArea(gameId: string, playerId: string) {
    const game = this.gameRepository.get(gameId);
    if (!game) {
      return;
    }

    const player = this.playerRepository.get(playerId);
    if (!player) {
      return;
    }

    game.flagArea(player.getPosition());
    this.gameRepository.add(game);
  }
}
