import { Constants } from '../utils/Constants'

class ActionMenuItem {
  private textItem: Phaser.GameObjects.Text
  constructor(scene) {
    this.textItem = scene.add
      .text(0, 0, 'Wait', {
        padding: {
          left: 10,
          top: 10,
        },
      })
      .setVisible(false)

    this.textItem.setFixedSize(Constants.CONTEXT_MENU_WIDTH, Constants.CONTEXT_MENU_HEIGHT)
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
  constructor(scene: Phaser.Scene) {}
}
