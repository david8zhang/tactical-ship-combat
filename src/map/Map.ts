import { Constants } from '~/utils/Constants'

export class Map {
  /**
   * Get the pixel coordinate of a given tile coordinate
   * @param x x tile coordinate
   * @param y y tile coordinate
   */
  static getPixelCoords(gridValue: number) {
    const scaledTileSize = Constants.TILE_SIZE * Constants.SCALE_FACTOR
    return scaledTileSize * gridValue + scaledTileSize / 2
  }
}
