import Game from '../scenes/Game'
import UIScene from '../scenes/UIScene'
import { Constants } from '../utils/Constants'
import { MapUtils } from '../utils/MapUtils'
import { Ship } from '../level/Ship'
import { Position } from '~/ui/UnitPreview'

export class Cursor {
  private gameScene!: Game
  private cursorImg!: Phaser.GameObjects.Image
  private currX: number
  private currY: number
  public selectedShip: Ship | null = null

  constructor(gameScene: Game, x: number, y: number) {
    this.gameScene = gameScene
    this.currX = x
    this.currY = y
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

    if (isLeft && this.currX > 0) {
      this.moveCursorHoriz(-1)
    }

    if (isRight && MapUtils.tileToPixelValue(this.currX + 1) < mapWidth) {
      this.moveCursorHoriz(1)
    }

    if (isDown && MapUtils.tileToPixelValue(this.currY + 1) < mapHeight) {
      this.moveCursorVert(1)
    }

    if (isUp && this.currY > 0) {
      this.moveCursorVert(-1)
    }

    // Press Space to select
    if (isSpace) {
      const level = this.gameScene.level

      // If there is already a selected ship
      if (this.selectedShip) {
        // If the space to move to is the same as the starting space
        if (this.currX === this.selectedShip.currX && this.currY == this.selectedShip.currY) {
          this.gameScene.level.turnOffAllHighlights()
          this.gameScene.actionMenu.enable(this.selectedShip)
        }

        // if the current space is moveable
        if (level.checkSpaceMoveable(this.currX, this.currY)) {
          const newPos = { x: this.currX, y: this.currY }
          level.moveShip(this.selectedShip, newPos, this.gameScene.level.playerShips, () => {
            this.gameScene.level.turnOffAllHighlights()

            // Enable the action menu
            this.gameScene.actionMenu.enable(this.selectedShip as Ship)
          })
        }
      } else {
        const ship = level.getShipAtPosition(this.currX, this.currY)
        if (ship && !ship.hasMoved && ship.side === 'Player') {
          this.selectedShip = ship
          this.gameScene.level.highlightMoveableSquares(ship)
        }
      }
    }

    const shipUnderCursor = this.getShipUnderCursor()
    if (shipUnderCursor) {
      this.showShipUnitPreviewMenu()
    } else {
      UIScene.getInstance().unitPreview.disable()
    }
  }

  // 1 = Right, -1 = Left
  moveCursorHoriz(direction: number) {
    const { camera } = this.gameScene
    const bound = direction === 1 ? camera.worldView.right : camera.worldView.left
    const offset = bound === camera.worldView.right ? MapUtils.tileToPixelValue(1) : 0
    this.cursorImg.setX(MapUtils.getPixelCoords(this.currX + direction))
    if (MapUtils.tileToPixelValue(this.currX) === bound - offset) {
      camera.scrollX(direction)
    }
    this.currX += direction
    this.getMenuPosBasedOnCamera()
  }

  // -1 = Up, 1 = Down
  moveCursorVert(direction: number) {
    const { camera } = this.gameScene
    const bound = direction === 1 ? camera.worldView.bottom : camera.worldView.top
    const offset = bound === camera.worldView.bottom ? MapUtils.tileToPixelValue(1) : 0
    this.cursorImg.setY(MapUtils.getPixelCoords(this.currY + direction))
    if (MapUtils.tileToPixelValue(this.currY) === bound - offset) {
      camera.scrollY(direction)
    }
    this.currY += direction
    this.getMenuPosBasedOnCamera()
  }

  showShipUnitPreviewMenu() {
    const position = this.getMenuPosBasedOnCamera()
    UIScene.getInstance().unitPreview.enable(position)
  }

  // If the item being hovered over is in the bottom left, spawn the menu on the bottom right and vice versa
  getMenuPosBasedOnCamera() {
    const { camera } = this.gameScene
    const { unitPreview } = UIScene.getInstance()

    const offsetX = MapUtils.tileToPixelValue(camera.getOffsetX())
    const offsetY = MapUtils.tileToPixelValue(camera.getOffsetY())

    const { panelHeight, panelWidth } = unitPreview
    const paddedPanelHeight = panelHeight + MapUtils.tileToPixelValue(1)
    const paddedPanelWidth = panelWidth + MapUtils.tileToPixelValue(1)

    // Left Menu bounds
    const leftMenuBounds = [
      [offsetX, Constants.GAME_WINDOW_HEIGHT + offsetY - paddedPanelHeight], // top left corner
      [offsetX + paddedPanelWidth, Constants.GAME_WINDOW_HEIGHT + offsetY - paddedPanelHeight], // top right corner
      [offsetX, Constants.GAME_WINDOW_HEIGHT + offsetY], // Bottom Left corner
      [offsetX + paddedPanelWidth, Constants.GAME_WINDOW_HEIGHT + offsetY], // Bottom right corner
    ]
    if (this.isCursorInRectBounds(leftMenuBounds)) {
      return Position.BOTTOM_RIGHT
    }
    return Position.BOTTOM_LEFT
  }

  isCursorInRectBounds(rect: number[][]) {
    const topLeft = rect[0]
    const topRight = rect[1]
    const bottomLeft = rect[2]
    return (
      MapUtils.tileToPixelValue(this.currX) >= topLeft[0] &&
      MapUtils.tileToPixelValue(this.currX) <= topRight[0] &&
      MapUtils.tileToPixelValue(this.currY) >= topLeft[1] &&
      MapUtils.tileToPixelValue(this.currY) <= bottomLeft[1]
    )
  }

  getShipUnderCursor(): Ship | null {
    const { level } = this.gameScene
    return level.getShipAtPosition(this.currX, this.currY)
  }

  choosePostMoveAction(option) {
    // Process the different options that are available to player after moving
    this.selectedShip!.setHasMoved(true)
    this.selectedShip = null
    this.gameScene.actionMenu.disable()

    // If all ships have moved, progress to enemy turn
    const { level, ai } = this.gameScene
    const playerShips = level.playerShips
    const enemyShips = level.enemyShips
    if (level.haveAllShipsMoved(playerShips)) {
      ai.moveEnemies(() => {
        level.resetShipMoveStates(playerShips)
        level.resetShipMoveStates(enemyShips)
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
      this.currX = row
      this.currY = col
    }
  }

  getCursorPos(): number[] {
    return [this.currX, this.currY]
  }
}
