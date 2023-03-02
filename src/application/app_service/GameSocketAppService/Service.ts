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

    const originPos = new PositionVo(
      -1,
      Math.floor(game.getSize().getHeight() / 2),
    );
    const newPlayer = new PlayerAgg(
      playerId,
      gameId,
      name,
      originPos,
      new DirectionVo(1),
    );
    this.playerRepository.add(newPlayer);

    this.integrationEventPublisher.publish(IntegrationEvent.PlayersUpdated);
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
    myPlayerId: string,
  ) {
    const players = this.playerRepository.getAll(gameId);
    const response: PlayersUpdatedResponseDto = {
      type: ResponseDtoType.PlayersUpdated,
      players: players.map(newPlayerAggDto),
      myPlayerId,
    };
    presenter.onMessage(JSON.stringify(response));
  }

  public createGame(): GameAggDto {
    const newGame = new GameAgg(
      "dc3e3d8c-da82-4e15-8263-49c178f57bff",
      new SizeVo(41, 41),
      120,
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
    const newDirection = new DirectionVo(
      (player.getDirection().toNumber() + direction.toNumber()) % 4,
    );

    if (direction.toNumber() === 0) {
      let newPos = player.getPosition();
      switch (newDirection.toNumber() % 4) {
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
      if (game.getSize().includePos(newPos)) {
        const areaStood = game.getArea(newPos);
        if (!areaStood.getFlagged()) {
          player.setPosition(newPos);

          if (!areaStood.getRevealed()) {
            game.revealArea(newPos);
            this.gameRepository.update(game);
            this.integrationEventPublisher.publish(
              IntegrationEvent.GameUpdated,
            );
          }
        }
      }
    }

    player.setDirection(newDirection);

    this.playerRepository.update(player);
    this.integrationEventPublisher.publish(IntegrationEvent.PlayersUpdated);
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

    let flagPos = player.getPosition();
    switch (player.getDirection().toNumber()) {
      case 0:
        flagPos = flagPos.shift(0, -1);
        break;
      case 1:
        flagPos = flagPos.shift(1, 0);
        break;
      case 2:
        flagPos = flagPos.shift(0, 1);
        break;
      case 3:
        flagPos = flagPos.shift(-1, 0);
        break;
    }

    if (!game.getSize().includePos(flagPos)) {
      return;
    }

    game.flagArea(flagPos);
    this.gameRepository.add(game);

    this.integrationEventPublisher.publish(IntegrationEvent.GameUpdated);
  }

  public changeCamera(gameId: string) {
    const game = this.gameRepository.get(gameId);
    if (!game) {
      return;
    }

    game.changeCamera();
    this.gameRepository.update(game);

    this.integrationEventPublisher.publish(IntegrationEvent.GameUpdated);
  }

  public resetGame(gameId: string) {
    const game = this.gameRepository.get(gameId);
    if (!game) {
      return;
    }

    const allPlayers = this.playerRepository.getAll(gameId);
    allPlayers.forEach((player) => {
      const originPos = new PositionVo(
        -1,
        Math.floor(game.getSize().getHeight() / 2),
      );
      player.setPosition(originPos);
      this.playerRepository.update(player);
      this.integrationEventPublisher.publish(IntegrationEvent.PlayersUpdated);
    });

    game.reset();
    this.gameRepository.update(game);
    this.integrationEventPublisher.publish(IntegrationEvent.GameUpdated);
  }
}
