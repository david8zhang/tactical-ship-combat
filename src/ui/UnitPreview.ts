import { Constants } from '~/utils/Constants'
export enum Position {
  BOTTOM_LEFT = 'bottom left',
  BOTTOM_RIGHT = 'bottom right',
}

export class UnitPreview {
  private scene: Phaser.Scene
  public panelWidth: number = 125
  public panelHeight: number = 150
  private container: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const { width, height } = scene.scale
    this.container = scene.add.container(0, 0)
    this.container.setDepth(1000)
    const panel = scene.add.nineslice(0, 0, this.panelWidth, this.panelHeight, 'panel', 24)
    const text = scene.add.text(0, 0, 'Hello', {
      color: 'black',
      fontSize: '15px',
      padding: {
        left: 10,
        top: 10,
      },
    })
    this.container.add(panel)
    this.container.add(text)
    this.container.setAlpha(0.7)
    this.container.setVisible(false)
  }

  setPosition(position: Position) {
    switch (position) {
      case Position.BOTTOM_LEFT: {
        this.container.setX(0)
        this.container.setY(Constants.GAME_WINDOW_HEIGHT - this.panelHeight)
        break
      }
      case Position.BOTTOM_RIGHT: {
        this.container.setX(Constants.GAME_WINDOW_WIDTH - this.panelWidth)
        this.container.setY(Constants.GAME_WINDOW_HEIGHT - this.panelHeight)
        break
      }
      default: {
        this.container.setX(0)
        this.container.setY(Constants.GAME_WINDOW_HEIGHT - this.panelHeight)
        break
      }
    }
  }

  disable() {
    this.container.setVisible(false)
  }

  enable(position: Position) {
    this.container.setVisible(true)
    this.setPosition(position)
  }
}
