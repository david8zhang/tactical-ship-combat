import Game from '../scenes/Game'
import { Ship, ShipConfig } from './Ship'

interface AIConfig {
  enemyShips: any[]
}

export class AI {
  private scene: Game
  private config: AIConfig
  constructor(scene: Game, aiConfig: AIConfig) {
    this.scene = scene
    this.config = aiConfig
  }

  moveShip(ships: Ship[], index: number, onLastMoved: Function) {
    const { level } = this.scene
    const playerShips = level.getShipsAsList(level.playerShips)
    if (index === ships.length) {
      onLastMoved()
      return
    }
    // do movement stuff
    const shipToMove: Ship = ships[index]
    const newPos = {
      x: shipToMove.currX - 1,
      y: shipToMove.currY - 1,
    }
    const enemyShips = this.scene.level.enemyShips
    this.scene.level.moveShip(shipToMove, newPos, enemyShips, () => {
      this.moveShip(ships, index + 1, onLastMoved)
    })
  }

  moveEnemies(cb: Function) {
    const { level } = this.scene
    const enemyShips = level.getShipsAsList(level.enemyShips)
    this.moveShip(enemyShips, 0, cb)
  }
}
