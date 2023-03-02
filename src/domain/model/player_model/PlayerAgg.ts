import { PositionVo } from "../common_model/mod.ts";
import DirectionVo from "./DirectionVo.ts";

export default class PlayerAgg {
  private id: string;
  private gameId: string;
  private name: string;
  private position: PositionVo;
  private direction: DirectionVo;
  private guilty: boolean;

  constructor(
    id: string,
    gameId: string,
    name: string,
    position: PositionVo,
    direction: DirectionVo,
    guilty: boolean,
  ) {
    this.id = id;
    this.gameId = gameId;
    this.name = name;
    this.position = position;
    this.direction = direction;
    this.guilty = guilty;
  }

  public getId() {
    return this.id;
  }

  public getGameId() {
    return this.gameId;
  }

  public getName() {
    return this.name;
  }

  public getPosition() {
    return this.position;
  }

  public setPosition(position: PositionVo) {
    this.position = position;
  }

  public getDirection() {
    return this.direction;
  }

  public setDirection(direction: DirectionVo) {
    this.direction = direction;
  }

  public getGuilty() {
    return this.guilty;
  }

  public setGuilty(guilty: boolean) {
    this.guilty = guilty;
  }
}
