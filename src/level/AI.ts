import { PathUtils } from '~/utils/PathUtils'
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
    if (index === ships.length) {
      onLastMoved()
      return
    }
    // do movement stuff
    const shipToMove: Ship = ships[index]
    const closestSquareToPlayerShip = this.getSquareClosestToPlayerShip(shipToMove)
    const newPos = {
      x: closestSquareToPlayerShip[0],
      y: closestSquareToPlayerShip[1],
    }
    const enemyShips = this.scene.level.enemyShips
    this.scene.level.moveShip(shipToMove, newPos, enemyShips, () => {
      this.moveShip(ships, index + 1, onLastMoved)
    })
  }

  getSquareClosestToPlayerShip(shipToMove: Ship) {
    const { level } = this.scene
    const playerShips = level.getShipsAsList(level.playerShips)
    const moveableSquares = level.getMoveableSquares(shipToMove)
    let closestSquare = moveableSquares[0]
    let closestDist = Number.MAX_SAFE_INTEGER
    moveableSquares.forEach((square: number[]) => {
      playerShips.forEach((ship: Ship) => {
        const { currX, currY } = ship
        const distance = PathUtils.pythagoreanDistance(
          { x: square[0], y: square[1] },
          { x: currX, y: currY }
        )
        if (distance < closestDist) {
          closestSquare = square
          closestDist = distance
        }
      })
    })
    return closestSquare
  }

  moveEnemies(cb: Function) {
    const { level } = this.scene
    setTimeout(() => {
      const enemyShips = level.getShipsAsList(level.enemyShips)
      this.moveShip(enemyShips, 0, cb)
    }, 1000)
  }
}
