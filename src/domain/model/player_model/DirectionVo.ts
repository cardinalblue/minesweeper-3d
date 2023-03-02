export default class DirectionVo {
  private direction: number;
  constructor(direction: number) {
    this.direction = direction;
  }

  public toNumber(): number {
    return this.direction;
  }
}
