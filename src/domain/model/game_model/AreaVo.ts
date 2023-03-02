export default class AreaVo {
  private _revealed: boolean;

  private _flagged: boolean;

  private _hasMine: boolean;

  private _adjMinesCount: number;

  private _boomed: boolean;

  constructor(
    revealed: boolean,
    flagged: boolean,
    hasMine: boolean,
    adjMinesCount: number,
    boomed: boolean,
  ) {
    this._revealed = revealed;
    this._flagged = flagged;
    this._hasMine = hasMine;
    this._adjMinesCount = adjMinesCount;
    this._boomed = boomed;
  }

  public getRevealed() {
    return this._revealed;
  }

  public setRevealed(revealed: boolean): AreaVo {
    return new AreaVo(
      revealed,
      this._flagged,
      this._hasMine,
      this._adjMinesCount,
      this._boomed,
    );
  }

  public getFlagged() {
    return this._flagged;
  }

  public setFlagged(flagged: boolean): AreaVo {
    return new AreaVo(
      this._revealed,
      flagged,
      this._hasMine,
      this._adjMinesCount,
      this._boomed,
    );
  }

  public getHasMine() {
    return this._hasMine;
  }

  public setHasMine(hasMine: boolean): AreaVo {
    return new AreaVo(
      this._revealed,
      this._flagged,
      hasMine,
      this._adjMinesCount,
      this._boomed,
    );
  }

  public getAdjMinesCount() {
    return this._adjMinesCount;
  }

  public setAdjMinesCount(adjMinesCount: number): AreaVo {
    return new AreaVo(
      this._revealed,
      this._flagged,
      this._hasMine,
      adjMinesCount,
      this._boomed,
    );
  }

  public getBoomed() {
    return this._boomed;
  }

  public setBoomed(boomed: boolean) {
    return new AreaVo(
      this._revealed,
      this._flagged,
      this._hasMine,
      this._adjMinesCount,
      boomed,
    );
  }
}
