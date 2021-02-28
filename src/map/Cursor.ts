import { Constants } from '~/utils/Constants'
import { Map } from './Map'

export class Cursor {
  private scene!: Phaser.Scene
  private cursorImg!: Phaser.GameObjects.Image
  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene
    this.cursorImg = this.scene.add.image(0, 0, 'cursor')
    this.cursorImg.scale = Constants.SCALE_FACTOR
    this.cursorImg.setX(Map.getPixelCoords(x))
    this.cursorImg.setY(Map.getPixelCoords(y))
  }
}
