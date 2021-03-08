import { MapUtils } from '~/utils/MapUtils'
import { Constants } from '../utils/Constants'

export class ActionMenuItem {
  private textItem: Phaser.GameObjects.Text
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
  private scene: Phaser.Scene
  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  getActions() {
    return [
      new ActionMenuItem(this.scene, 'Attack'),
      new ActionMenuItem(this.scene, 'Wait'),
      new ActionMenuItem(this.scene, 'Cancel'),
    ]
  }

  createMenu(position: { x: number; y: number }) {
    const actionList = this.getActions()
    const { x, y } = position
    actionList.forEach((item: ActionMenuItem, index: number) => {
      item.setX(MapUtils.getPixelCoords(x) + Constants.ACTION_MENU_OFFSET_X)
      item.setY(MapUtils.tileToPixelValue(y) + index * Constants.ACTION_MENU_HEIGHT)
      item.setVisible(true)
    })
  }
}
