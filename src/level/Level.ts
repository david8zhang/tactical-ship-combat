import { Constants } from '../utils/Constants'
import { PathUtils } from '../utils/PathUtils'
import { Ship } from './Ship'
import Game from '../scenes/Game'

export class Level {
  private mapObject: number[][]
  private map!: Phaser.Tilemaps.Tilemap
  private scene: Game
  private highlightedSquares: string[] = []

  public playerShips: (Ship | null)[][]
  public enemyShips: (Ship | null)[][]

  constructor(scene: Game) {
    this.mapObject = []
    this.playerShips = []
    this.enemyShips = []
    this.scene = scene
  }

  initMap() {
    this.map = this.scene.make.tilemap({
      key: 'ocean',
      tileHeight: 64,
      tileWidth: 64,
    })
    this.map.addTilesetImage('ocean_tiles', 'tiles')
    for (let i = 0; i < this.map.layers.length; i++) {
      // configure layer
      const layer = this.map.createLayer(this.map.layers[i].name, 'ocean_tiles', 0, 0)
      layer.setDepth(i)
      layer.scale = Constants.SCALE_FACTOR

      const layerData = layer.layer.data
      this.initializeObjectMaps(layerData)
    }
    return this.map
  }

  initializeObjectMaps(tiles: Phaser.Tilemaps.Tile[][]) {
    for (let i = 0; i < tiles.length; i++) {
      if (!this.mapObject[i]) this.mapObject[i] = new Array(tiles[0].length)
      if (!this.playerShips[i]) this.playerShips[i] = new Array(tiles[0].length)
      if (!this.enemyShips[i]) this.enemyShips[i] = new Array(tiles[0].length)

      for (let j = 0; j < tiles[0].length; j++) {
        if (tiles[i][j].index !== -1) {
          this.mapObject[i][j] = tiles[i][j].index
        }
        this.playerShips[i][j] = null
        this.enemyShips[i][j] = null
      }
    }
  }

  addEnemyShips(ships: Ship[]) {
    ships.forEach((ship: Ship) => {
      this.enemyShips[ship.currY][ship.currX] = ship
    })
  }

  addPlayerShips(ships: Ship[]) {
    ships.forEach((ship: Ship) => {
      this.playerShips[ship.currY][ship.currX] = ship
    })
  }

  getShipAtPosition(x: number, y: number): Ship | null {
    return this.playerShips[y][x] || this.enemyShips[y][x]
  }

  isShipAtPosition(x: number, y: number): boolean {
    return this.playerShips[y][x] !== null || this.enemyShips[y][x] !== null
  }

  checkShipInAttackRange(ship: Ship) {
    const squaresInRange = PathUtils.getSquaresInRange(ship.attackRange + 1, ship.currX, ship.currY)
    for (let i = 0; i < squaresInRange.length; i++) {
      const square = squaresInRange[i]
      if (this.isTileInBounds(square[0], square[1])) {
        const attackableShip = this.getShipAtPosition(square[0], square[1])
        if (attackableShip && attackableShip.side !== ship.side) {
          return true
        }
      }
    }
    return false
  }

  moveShip(
    ship: Ship,
    newPos: { x: number; y: number },
    shipPositions: (Ship | null)[][],
    cb: Function
  ) {
    const { x, y } = newPos
    const oldX = ship.currX
    const oldY = ship.currY
    shipPositions[oldY][oldX] = null
    ship.move(x, y, () => {
      shipPositions[y][x] = ship
      cb()
    })
  }

  checkSpaceMoveable(x: number, y: number) {
    return this.highlightedSquares.includes(`${x},${y}`)
  }

  isObjectAtSpace(x: number, y: number) {
    return this.isShipAtPosition(x, y) || Constants.GET_TILE_TYPE(this.mapObject[y][x]) != 'Ocean'
  }

  getMoveableSquares(ship: Ship) {
    return PathUtils.getSquaresInRange(ship.moveRange, ship.currX, ship.currY)
      .filter((square) => {
        const [x, y] = square
        return this.isTileInBounds(x, y)
      })
      .filter((square) => {
        const [x, y] = square
        return !this.isObjectAtSpace(x, y)
      })
  }

  highlightMoveableSquares(ship: Ship) {
    const moveableSquares = this.getMoveableSquares(ship)
    moveableSquares.forEach((square) => {
      this.highlightTile(square[0], square[1])
    })
    this.highlightedSquares = moveableSquares.map((square) => `${square[0]},${square[1]}`)
  }

  turnOffAllHighlights() {
    const layer = this.map.layers[0]
    for (let i = 0; i < layer.data.length; i++) {
      for (let j = 0; j < layer.data[0].length; j++) {
        layer.data[j][i].clearAlpha()
      }
    }
  }

  isTileInBounds(x, y) {
    const tileData = this.map.layers[0]
    return y >= 0 && y < tileData.data.length && x >= 0 && x < tileData.data[0].length
  }

  highlightTile(x: number, y: number) {
    const tileData = this.map.layers[0]
    if (this.isTileInBounds(x, y)) {
      const tile: Phaser.Tilemaps.Tile = tileData.data[y][x]
      tile.tint = 0xffffff
      tile.setAlpha(0.8)
    }
  }

  haveAllShipsMoved(ships: (Ship | null)[][]) {
    for (let i = 0; i < ships.length; i++) {
      for (let j = 0; j < ships[0].length; j++) {
        const ship: Ship = ships[i][j] as Ship
        if (ship && !ship.hasMoved) {
          return false
        }
      }
    }
    return true
  }

  resetShipMoveStates(ships: (Ship | null)[][]) {
    for (let i = 0; i < ships.length; i++) {
      for (let j = 0; j < ships[0].length; j++) {
        const ship: Ship = ships[i][j] as Ship
        if (ship) {
          ship.setHasMoved(false)
        }
      }
    }
    return true
  }

  getShipsAsList(ships: (Ship | null)[][]) {
    const shipList: Ship[] = []
    for (let i = 0; i < ships.length; i++) {
      for (let j = 0; j < ships[0].length; j++) {
        const ship: Ship = ships[i][j] as Ship
        if (ship) {
          shipList.push(ship)
        }
      }
    }
    return shipList
  }
}
