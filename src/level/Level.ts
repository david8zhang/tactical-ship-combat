import { Constants } from '../utils/Constants'
import { PathUtils } from '../utils/PathUtils'
import { Ship } from './Ship'
import Game from '../scenes/Game'

export class Level {
  private mapObject: number[][]
  private map!: Phaser.Tilemaps.Tilemap
  private ships: (Ship | null)[][]
  private scene: Game
  private highlightedSquares: string[] = []

  constructor(scene: Game) {
    this.mapObject = []
    this.ships = []
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
      if (!this.ships[i]) this.ships[i] = new Array(tiles[0].length)

      for (let j = 0; j < tiles[0].length; j++) {
        if (tiles[i][j].index !== -1) {
          this.mapObject[i][j] = tiles[i][j].index
        }
        this.ships[i][j] = null
      }
    }
  }

  addShips(ships: Ship[]) {
    ships.forEach((ship: Ship) => {
      this.ships[ship.currY][ship.currX] = ship
    })
  }

  getShipAtPosition(x: number, y: number): Ship | null {
    return this.ships[y][x]
  }

  isShipAtPosition(x: number, y: number): boolean {
    return this.ships[y][x] !== null
  }

  moveShip(ship: Ship, x: number, y: number) {
    const oldX = ship.currX
    const oldY = ship.currY
    this.ships[oldY][oldX] = null
    ship.move(x, y)
    this.ships[y][x] = ship
  }

  checkSpaceMoveable(x: number, y: number) {
    return this.highlightedSquares.includes(`${x},${y}`)
  }

  isObjectAtSpace(x: number, y: number) {
    return this.isShipAtPosition(x, y) || Constants.GET_TILE_TYPE(this.mapObject[y][x]) != 'Ocean'
  }

  highlightMoveableSquares(start: { x: number; y: number }, ship: Ship) {
    const moveableSquares = PathUtils.getSquaresInRange(ship.moveRange, start.x, start.y)
      .filter((square) => {
        const [x, y] = square
        return this.isTileInBounds(x, y)
      })
      .filter((square) => {
        const [x, y] = square
        return !this.isObjectAtSpace(x, y)
      })
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
}
