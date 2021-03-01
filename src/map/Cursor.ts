import Game from '../scenes/Game'
import { Constants } from '../utils/Constants'
import { Map } from './Map'
import { Ship } from '../level/Ship'

export class Cursor {
  private gameScene!: Game
  private cursorImg!: Phaser.GameObjects.Image
  private currRow: number
  private currCol: number
  private selectedShip: Ship | null = null

  constructor(gameScene: Game, x: number, y: number) {
    this.gameScene = gameScene
    this.currRow = x
    this.currCol = y
    this.cursorImg = this.gameScene.add.image(0, 0, 'cursor')
    this.cursorImg.setDepth(gameScene.map.layers.length + 1)
    this.cursorImg.scale = Constants.SCALE_FACTOR
    this.cursorImg.setX(Map.getPixelCoords(x))
    this.cursorImg.setY(Map.getPixelCoords(y))
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Cursor controls
    const isLeft = this.gameScene.input.keyboard.checkDown(cursors.left, 100)
    const isRight = this.gameScene.input.keyboard.checkDown(cursors.right, 100)
    const isDown = this.gameScene.input.keyboard.checkDown(cursors.down, 100)
    const isUp = this.gameScene.input.keyboard.checkDown(cursors.up, 100)
    const isSpace = this.gameScene.input.keyboard.checkDown(cursors.space, 100)

    const mapWidth = this.gameScene.map.widthInPixels * Constants.SCALE_FACTOR
    const mapHeight = this.gameScene.map.heightInPixels * Constants.SCALE_FACTOR

    if (isLeft && this.currRow > 0) {
      this.cursorImg.setX(Map.getPixelCoords(this.currRow - 1))
      if (Map.tileToPixelValue(this.currRow) == this.gameScene.camera.worldView.left) {
        this.gameScene.camera.scrollX(-1)
      }
      this.currRow -= 1
    }

    if (isRight && Map.tileToPixelValue(this.currRow + 1) < mapWidth) {
      this.cursorImg.setX(Map.getPixelCoords(this.currRow + 1))
      if (
        Map.tileToPixelValue(this.currRow) ==
        this.gameScene.camera.worldView.right - Map.tileToPixelValue(1)
      ) {
        this.gameScene.camera.scrollX(1)
      }
      this.currRow += 1
    }

    if (isDown && Map.tileToPixelValue(this.currCol + 1) < mapHeight) {
      this.cursorImg.setY(Map.getPixelCoords(this.currCol + 1))
      if (
        Map.tileToPixelValue(this.currCol) ==
        this.gameScene.camera.worldView.bottom - Map.tileToPixelValue(1)
      ) {
        this.gameScene.camera.scrollY(1)
      }
      this.currCol += 1
    }

    if (isUp && this.currCol > 0) {
      this.cursorImg.setY(Map.getPixelCoords(this.currCol - 1))
      if (Map.tileToPixelValue(this.currCol) == this.gameScene.camera.worldView.top) {
        this.gameScene.camera.scrollY(-1)
      }
      this.currCol -= 1
    }

    // Press Space to select
    if (isSpace) {
      const level = this.gameScene.level
      if (this.selectedShip && level.checkSpaceMoveable(this.currRow, this.currCol)) {
        level.moveShip(this.selectedShip, this.currRow, this.currCol)
        this.selectedShip = null
      } else {
        const ship = level.getShipAtPosition(this.currRow, this.currCol)
        if (ship) {
          this.selectedShip = ship
        }
      }
    }
  }

  isPosInBounds(row: number, col: number) {
    return (
      row >= 0 &&
      row <= this.gameScene.map.tileWidth &&
      col >= 0 &&
      col <= this.gameScene.map.tileHeight
    )
  }

  setCursorPos(row: number, col: number) {
    if (this.isPosInBounds(row, col)) {
      this.cursorImg.setX(Map.getPixelCoords(row))
      this.cursorImg.setY(Map.getPixelCoords(col))
      this.currRow = row
      this.currCol = col
    }
  }

  getCursorPos(): number[] {
    return [this.currRow, this.currCol]
  }
}
