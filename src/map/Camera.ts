import { MapUtils } from '../utils/MapUtils'
import { Constants } from '../utils/Constants'

export class Camera {
  public camera: Phaser.Cameras.Scene2D.Camera
  public worldView: Phaser.Geom.Rectangle
  constructor(camera) {
    this.camera = camera
    this.worldView = this.camera.worldView
  }

  /**
   * Move camera horizontal
   * @param  {int} tile number of tiles to move
   * @return {none}
   */
  scrollX(tile: number) {
    this.camera.scrollX = this.camera.scrollX + MapUtils.tileToPixelValue(tile)
  }

  /**
   * Move camera vertical
   * @param  {int} tile number of tiles to move
   * @return {none}
   */
  scrollY(tile: number) {
    this.camera.scrollY = this.camera.scrollY + MapUtils.tileToPixelValue(tile)
  }

  /**
   * get camera offset from left border
   * @return {int}
   */
  getOffsetX() {
    return this.camera.scrollX / Constants.SCALED_TILE_SIZE
  }

  /**
   * Get camera offset from top border
   * @return {int}
   */
  getOffsetY() {
    return this.camera.scrollY / Constants.SCALED_TILE_SIZE
  }
}
