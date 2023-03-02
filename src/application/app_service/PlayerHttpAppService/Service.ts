import type { PlayerRepository } from "../../../domain/model/player_model/mod.ts";
import {
  DirectionVo,
  PlayerAgg,
} from "../../../domain/model/player_model/mod.ts";
import { newPlayerAggDto } from "../../dto/mod.ts";
import { PositionVo } from "../../../domain/model/common_model/mod.ts";
import type Presenter from "./Presenter.ts";

export default class Service {
  private playerRepository: PlayerRepository;

  constructor(playerRepository: PlayerRepository) {
    this.playerRepository = playerRepository;
  }

  public createPlayer(presenter: Presenter, gameId: string, name: "Luna") {
    const newPlayer = new PlayerAgg(
      crypto.randomUUID(),
      gameId,
      name,
      new PositionVo(0, 0),
      new DirectionVo(0),
    );
    this.playerRepository.add(newPlayer);

    const response = newPlayerAggDto(newPlayer);
    presenter.onSuccess(JSON.stringify(response));
  }
}
