import { PlayerAgg } from "../../../domain/model/player_model/mod.ts";
import type { PlayerRepository } from "../../../domain/model/player_model/mod.ts";

let players: PlayerAgg[] = [];
const findPlayer = (playerId: string) =>
  players.find((player) => player.getId() === playerId);

export default class PlayerMemRepository implements PlayerRepository {
  get(id: string): PlayerAgg | null {
    return players.find((p) => p.getId() === id) || null;
  }
  getAll(gameId: string): PlayerAgg[] {
    return players.filter((p) => p.getGameId() === gameId);
  }
  add(player: PlayerAgg): void {
    const playerFound = findPlayer(player.getId());
    if (playerFound) {
      players = players.map((p) => {
        if (p.getId() === player.getId()) {
          return player;
        }
        return p;
      });
    } else {
      players.push(player);
    }
  }
  update(player: PlayerAgg): void {
    const playerFound = findPlayer(player.getId());
    if (playerFound) {
      players = players.map((p) => {
        if (p.getId() === player.getId()) {
          return player;
        }
        return p;
      });
    } else {
      players.push(player);
    }
  }
  delete(playerId: string): void {
    players.filter((p) => p.getId() !== playerId);
  }
}
