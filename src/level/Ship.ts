import { Constants } from '~/utils/Constants'
import { Map } from '../map/Map'

export enum ShipType {
  'Red' = 0,
  'Blue' = 1,
  'White' = 2,
  'Green' = 3,
  'Pirate' = 4,
  'Yellow' = 5,
}

export interface ShipConfig {
  name: string
  shipType: ShipType
  defaultPosition: {
    x: number
    y: number
  }
}

export class Ship {
  public name: string
  public currX: number
  public currY: number
  private gameScene: Phaser.Scene
  private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  constructor(scene: Phaser.Scene, shipConfig: ShipConfig) {
    this.name = shipConfig.name
    this.sprite = scene.physics.add.sprite(
      0,
      0,
      'ship',
      shipConfig.shipType || 0
    )
    this.gameScene = scene
    this.currX = shipConfig.defaultPosition.x
    this.currY = shipConfig.defaultPosition.y
    this.sprite.setDepth(2)
    this.sprite.scale = Constants.SCALE_FACTOR
    this.setPosition(shipConfig.defaultPosition.x, shipConfig.defaultPosition.y)
  }

  public setPosition(posX: number, posY: number) {
    this.sprite.setX(Map.getPixelCoords(posX))
    this.sprite.setY(Map.getPixelCoords(posY))
  }

  public move(x: number, y: number) {
    const xDiff =
      (x - this.currX) * (Constants.TILE_SIZE * Constants.SCALE_FACTOR)
    const yDiff =
      (y - this.currY) * (Constants.TILE_SIZE * Constants.SCALE_FACTOR)
    this.gameScene.tweens.add({
      targets: this.sprite,
      duration: 350,
      x: `+=${xDiff}`,
      y: `+=${yDiff}`,
      onComplete: () => {
        this.sprite.setX(Map.getPixelCoords(x))
        this.sprite.setY(Map.getPixelCoords(y))
        this.currX = x
        this.currY = y
      },
    })
  }
}
