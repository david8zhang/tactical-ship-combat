import Game from '../scenes/Game'
import { Constants } from '../utils/Constants'
import { MapUtils } from '../utils/MapUtils'
import { Ship } from '../level/Ship'

export class Cursor {
  private gameScene!: Game
  private cursorImg!: Phaser.GameObjects.Image
  private currRow: number
  private currCol: number
  public selectedShip: Ship | null = null

  constructor(gameScene: Game, x: number, y: number) {
    this.gameScene = gameScene
    this.currRow = x
    this.currCol = y
    this.cursorImg = this.gameScene.add.image(0, 0, 'cursor')
    this.cursorImg.setDepth(gameScene.map.layers.length + 1)
    this.cursorImg.scale = Constants.SCALE_FACTOR
    this.cursorImg.setX(MapUtils.getPixelCoords(x))
    this.cursorImg.setY(MapUtils.getPixelCoords(y))
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Cursor controls
    const isLeft = this.gameScene.input.keyboard.checkDown(cursors.left, 100)
    const isRight = this.gameScene.input.keyboard.checkDown(cursors.right, 100)
    const isDown = this.gameScene.input.keyboard.checkDown(cursors.down, 100)
    const isUp = this.gameScene.input.keyboard.checkDown(cursors.up, 100)
    const isSpace = Phaser.Input.Keyboard.JustDown(cursors.space)

    const mapWidth = this.gameScene.map.widthInPixels * Constants.SCALE_FACTOR
    const mapHeight = this.gameScene.map.heightInPixels * Constants.SCALE_FACTOR

    if (isLeft && this.currRow > 0) {
      this.cursorImg.setX(MapUtils.getPixelCoords(this.currRow - 1))
      if (MapUtils.tileToPixelValue(this.currRow) == this.gameScene.camera.worldView.left) {
        this.gameScene.camera.scrollX(-1)
      }
      this.currRow -= 1
    }

    if (isRight && MapUtils.tileToPixelValue(this.currRow + 1) < mapWidth) {
      this.cursorImg.setX(MapUtils.getPixelCoords(this.currRow + 1))
      if (
        MapUtils.tileToPixelValue(this.currRow) ==
        this.gameScene.camera.worldView.right - MapUtils.tileToPixelValue(1)
      ) {
        this.gameScene.camera.scrollX(1)
      }
      this.currRow += 1
    }

    if (isDown && MapUtils.tileToPixelValue(this.currCol + 1) < mapHeight) {
      this.cursorImg.setY(MapUtils.getPixelCoords(this.currCol + 1))
      if (
        MapUtils.tileToPixelValue(this.currCol) ==
        this.gameScene.camera.worldView.bottom - MapUtils.tileToPixelValue(1)
      ) {
        this.gameScene.camera.scrollY(1)
      }
      this.currCol += 1
    }

    if (isUp && this.currCol > 0) {
      this.cursorImg.setY(MapUtils.getPixelCoords(this.currCol - 1))
      if (MapUtils.tileToPixelValue(this.currCol) == this.gameScene.camera.worldView.top) {
        this.gameScene.camera.scrollY(-1)
      }
      this.currCol -= 1
    }

    // Press Space to select
    if (isSpace) {
      const level = this.gameScene.level

      // If there is already a selected ship
      if (this.selectedShip) {
        if (level.checkSpaceMoveable(this.currRow, this.currCol)) {
          level.moveShip(this.selectedShip, this.currRow, this.currCol, () => {
            this.gameScene.level.turnOffAllHighlights()

            // Enable the action menu
            this.gameScene.actionMenu.enable({
              x: this.selectedShip!.currX,
              y: this.selectedShip!.currY,
            })
          })
        }
      } else {
        const ship = level.getShipAtPosition(this.currRow, this.currCol)
        if (ship && !ship.hasMoved) {
          this.selectedShip = ship
          this.gameScene.level.highlightMoveableSquares({ x: this.currRow, y: this.currCol }, ship)
        }
      }
    }
  }

  choosePostMoveAction(option) {
    // Process the different options that are available to player after moving
    this.selectedShip!.setHasMoved(true)
    this.selectedShip = null
    this.gameScene.actionMenu.disable()

    // If all ships have moved, progress to enemy turn
    console.log(this.gameScene.level.haveAllShipsMoved())
    if (this.gameScene.level.haveAllShipsMoved()) {
      this.gameScene.ai.moveEnemies(() => {
        this.gameScene.level.resetShipMoveStates()
      })
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
      this.cursorImg.setX(MapUtils.getPixelCoords(row))
      this.cursorImg.setY(MapUtils.getPixelCoords(col))
      this.currRow = row
      this.currCol = col
    }
  }

  getCursorPos(): number[] {
    return [this.currRow, this.currCol]
  }
}
