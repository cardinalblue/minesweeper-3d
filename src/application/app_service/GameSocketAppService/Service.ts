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
import type { IntegrationEventPublisher } from "../../integration_event/mod.ts";
import IntegrationEvent from "./IntegrationEvent.ts";

export default class Service {
  private gameRepository: GameRepository;
  private playerRepository: PlayerRepository;
  private integrationEventPublisher: IntegrationEventPublisher;

  constructor(
    gameRepository: GameRepository,
    playerRepository: PlayerRepository,
    integrationEventPublisher: IntegrationEventPublisher,
  ) {
    this.gameRepository = gameRepository;
    this.playerRepository = playerRepository;
    this.integrationEventPublisher = integrationEventPublisher;
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

  public addPlayer(
    playerId: string,
    gameId: string,
    name: string,
  ) {
    const game = this.gameRepository.get(gameId);
    if (!game) {
      return;
    }

    const originPos = new PositionVo(0, 0);
    const newPlayer = new PlayerAgg(
      playerId,
      gameId,
      name,
      originPos,
      new DirectionVo(2),
    );
    this.playerRepository.add(newPlayer);

    this.integrationEventPublisher.publish(IntegrationEvent.PlayersUpdated);

    const areaStood = game.getArea(originPos);
    if (!areaStood.getRevealed()) {
      game.revealArea(originPos);
      this.gameRepository.update(game);
      this.integrationEventPublisher.publish(IntegrationEvent.GameUpdated);
    }
  }

  public removePlayer(
    playerId: string,
  ) {
    this.playerRepository.delete(playerId);

    this.integrationEventPublisher.publish(IntegrationEvent.PlayersUpdated);
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
      "dc3e3d8c-da82-4e15-8263-49c178f57bff",
      new SizeVo(30, 30),
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
    player.setDirection(direction);

    this.playerRepository.update(player);
    this.integrationEventPublisher.publish(IntegrationEvent.PlayersUpdated);

    const areaStood = game.getArea(newPos);
    if (!areaStood.getRevealed()) {
      game.revealArea(newPos);
      this.gameRepository.update(game);
      this.integrationEventPublisher.publish(IntegrationEvent.GameUpdated);
    }
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
