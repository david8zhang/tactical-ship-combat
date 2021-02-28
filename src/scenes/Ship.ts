import { Constants } from '~/utils/Constants'
import { Map } from '../map/Map'

export class Ship {
  private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  constructor(
    scene: Phaser.Scene,
    posX: number,
    posY: number,
    shipType?: number
  ) {
    this.sprite = scene.physics.add.sprite(0, 0, 'ship', shipType || 0)
    this.sprite.setDepth(2)
    this.sprite.scale = Constants.SCALE_FACTOR
    this.sprite.setX(Map.getPixelCoords(posX))
    this.sprite.setY(Map.getPixelCoords(posY))
  }
}
