import Game from '../scenes/Game'
import { MapUtils } from '~/utils/MapUtils'
import { Constants } from '../utils/Constants'
import { Ship } from '~/level/Ship'

export class ActionMenuItem {
  private textItem: Phaser.GameObjects.Text
  public textStr: string
  constructor(scene: Phaser.Scene, text: string) {
    this.textItem = scene.add
      .text(0, 0, text, {
        backgroundColor: '#4287f5',
        padding: {
          left: 10,
          top: 8,
        },
      })
      .setDepth(4)
      .setVisible(false)

    this.textItem.setFixedSize(Constants.ACTION_MENU_WIDTH, Constants.ACTION_MENU_HEIGHT)
    this.textStr = text
  }

  setX(x) {
    this.textItem.setX(x)
  }

  setY(y) {
    this.textItem.setY(y)
  }

  setVisible(val) {
    this.textItem.setVisible(val)
  }
}

export class ActionMenu {
  private scene: Game
  private actionList: ActionMenuItem[] = []
  public isEnabled: boolean = false
  public selectedMenuItemIndex: number = 0
  public position: any = null

  private cursor: Phaser.GameObjects.Graphics | null

  constructor(scene: Game) {
    this.scene = scene
    this.actionList = [
      new ActionMenuItem(scene, 'Attack'),
      new ActionMenuItem(scene, 'Wait'),
      new ActionMenuItem(scene, 'Cancel'),
    ]

    this.cursor = null
    this.cursor = this.scene.add.graphics({
      lineStyle: {
        width: 2,
        color: 0x00ff00,
      },
      fillStyle: {
        color: 0xff0000,
      },
    })
    this.cursor.setDepth(5)
    this.cursor.clear()
    this.cursor
      .strokeRectShape(
        new Phaser.Geom.Rectangle(0, 0, Constants.ACTION_MENU_WIDTH, Constants.SCALED_TILE_SIZE)
      )
      .setVisible(false)
  }

  positionMenu(position: { x: number; y: number }, actionList: ActionMenuItem[]) {
    const { x, y } = position
    this.position = position
    actionList.forEach((item: ActionMenuItem, index: number) => {
      item.setX(MapUtils.getPixelCoords(x) + Constants.ACTION_MENU_OFFSET_X)
      item.setY(MapUtils.tileToPixelValue(y) + index * Constants.ACTION_MENU_HEIGHT)
    })
    this.cursor?.setX(MapUtils.getPixelCoords(x) + Constants.ACTION_MENU_OFFSET_X)
    this.cursor?.setY(
      MapUtils.tileToPixelValue(y) + this.selectedMenuItemIndex * Constants.ACTION_MENU_HEIGHT
    )
  }

  disable() {
    this.isEnabled = false
    this.actionList.forEach((item: ActionMenuItem) => {
      item.setVisible(false)
    })
    this.cursor?.setVisible(false)
  }

  getActionList(ship: Ship) {
    const isAttackable = this.scene.level.checkShipInAttackRange(ship)
    const actionList = [
      new ActionMenuItem(this.scene, 'Wait'),
      new ActionMenuItem(this.scene, 'Cancel'),
    ]
    if (isAttackable) {
      actionList.splice(1, 0, new ActionMenuItem(this.scene, 'Attack'))
    }
    return actionList
  }

  enable(ship: Ship) {
    const position = { x: ship.currX, y: ship.currY }
    this.isEnabled = true
    const actionList = this.getActionList(ship)
    this.positionMenu(position, actionList)
    actionList.forEach((item: ActionMenuItem) => {
      item.setVisible(true)
    })
    this.actionList = actionList
    this.cursor?.setVisible(true)
  }

  moveMenuIndex(moveAmt: number) {
    this.selectedMenuItemIndex += moveAmt
    if (this.selectedMenuItemIndex < 0) this.selectedMenuItemIndex = 0
    if (this.selectedMenuItemIndex >= this.actionList.length)
      this.selectedMenuItemIndex = this.actionList.length - 1
    this.cursor?.setY(
      MapUtils.tileToPixelValue(this.position.y) +
        this.selectedMenuItemIndex * Constants.ACTION_MENU_HEIGHT
    )
  }

  processSelectedMenuItem(): void {
    const selectedMenuItem: ActionMenuItem = this.actionList[this.selectedMenuItemIndex]
    this.scene.mapCursor.choosePostMoveAction(selectedMenuItem)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const isDown = Phaser.Input.Keyboard.JustDown(cursors.down)
    const isUp = Phaser.Input.Keyboard.JustDown(cursors.up)
    const isSpace = Phaser.Input.Keyboard.JustDown(cursors.space)
    if (isDown) {
      this.moveMenuIndex(1)
    }
    if (isUp) {
      this.moveMenuIndex(-1)
    }
    if (isSpace) {
      this.processSelectedMenuItem()
    }
  }
}
