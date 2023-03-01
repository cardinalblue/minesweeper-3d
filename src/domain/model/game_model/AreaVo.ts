export default class AreaVo {
  private _revealed: boolean;

  private _flagged: boolean;

  private _hasMine: boolean;

  private _adjMinesCount: number;

  constructor(
    revealed: boolean,
    flagged: boolean,
    hasMine: boolean,
    adjMinesCount: number,
  ) {
    this._revealed = revealed;
    this._flagged = flagged;
    this._hasMine = hasMine;
    this._adjMinesCount = adjMinesCount;
  }

  public getRevealed() {
    return this._revealed;
  }

  public getFlagged() {
    return this._flagged;
  }

  public getHasMine() {
    return this._hasMine;
  }

  public getAdjMinesCount() {
    return this._adjMinesCount;
  }

  public setRevealed(revealed: boolean): AreaVo {
    return new AreaVo(
      revealed,
      this._flagged,
      this._hasMine,
      this._adjMinesCount,
    );
  }

  public setFlagged(flagged: boolean): AreaVo {
    return new AreaVo(
      this._revealed,
      flagged,
      this._hasMine,
      this._adjMinesCount,
    );
  }

  public setHasMine(hasMine: boolean): AreaVo {
    return new AreaVo(
      this._revealed,
      this._flagged,
      hasMine,
      this._adjMinesCount,
    );
  }

  public setAdjMinesCount(adjMinesCount: number): AreaVo {
    return new AreaVo(
      this._revealed,
      this._flagged,
      this._hasMine,
      adjMinesCount,
    );
  }
}
