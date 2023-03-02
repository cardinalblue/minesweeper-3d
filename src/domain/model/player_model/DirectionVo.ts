export default class DirectionVo {
  private direction: number;
  constructor(direction: number) {
    this.direction = direction;
  }

  public isEqual(dir: DirectionVo): boolean {
    return this.direction === dir.toNumber();
  }

  public toNumber(): number {
    return this.direction;
  }
}
