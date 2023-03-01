export default class PlayerAgg {
  private id: string;
  private gameId: string;

  constructor(
    id: string,
    gameId: string,
  ) {
    this.id = id;
    this.gameId = gameId;
  }

  public getId() {
    return this.id;
  }

  public getGameId() {
    return this.gameId;
  }
}
