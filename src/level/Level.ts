import { MapUtils } from '../utils/MapUtils'
import { Constants } from '../utils/Constants'
import { PathUtils } from '../utils/PathUtils'
import { Ship } from './Ship'

export class Level {
  private mapObject: number[][]
  private ships: (Ship | null)[][]
  private scene: Phaser.Scene
  private highlightedTiles: Phaser.GameObjects.Text[] = []

  constructor(scene: Phaser.Scene) {
    this.mapObject = []
    this.ships = []
    this.scene = scene
  }

  initMap() {
    const map = this.scene.make.tilemap({
      key: 'ocean',
      tileHeight: 64,
      tileWidth: 64,
    })
    map.addTilesetImage('ocean_tiles', 'tiles')
    for (let i = 0; i < map.layers.length; i++) {
      // configure layer
      const layer = map.createLayer(map.layers[i].name, 'ocean_tiles', 0, 0)
      layer.setDepth(i)
      layer.scale = Constants.SCALE_FACTOR

      const layerData = layer.layer.data
      this.initializeObjectMaps(layerData)
    }
    return map
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
    ship.move(x, y)
    this.ships[y][x] = ship
  }

  checkSpaceMoveable(x: number, y: number, ship: Ship) {
    const moveableSquares = PathUtils.getSquaresInRange(ship.moveRange, ship.currX, ship.currY)
    const squareInMoveable =
      moveableSquares.find((square) => square[0] == x && square[1] == y) !== undefined
    return (
      squareInMoveable &&
      !this.isShipAtPosition(x, y) &&
      Constants.GET_TILE_TYPE(this.mapObject[y][x]) == 'Ocean'
    )
  }

  highlightMoveableSquares(start: { x: number; y: number }, moveRange: number) {
    const moveableSquares = PathUtils.getSquaresInRange(moveRange, start.x, start.y)
    moveableSquares.forEach((square) => {
      this.highlightTile(square[0], square[1])
    })
  }

  turnOffAllHighlights() {
    this.highlightedTiles.forEach((obj) => {
      obj.destroy()
    })
  }

  highlightTile(x: number, y: number) {
    let textTile = this.scene.add.text(
      MapUtils.tileToPixelValue(x),
      MapUtils.tileToPixelValue(y),
      '',
      {
        backgroundColor: '#4287F580',
      }
    )
    textTile.setFixedSize(Constants.SCALED_TILE_SIZE, Constants.SCALED_TILE_SIZE)
    this.highlightedTiles.push(textTile)
  }
}
