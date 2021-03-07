import { MapUtils } from './MapUtils'

export class Constants {
  public static get TILE_SIZE() {
    return 64
  }

  public static get SCALED_TILE_SIZE() {
    return Constants.SCALE_FACTOR * Constants.TILE_SIZE
  }

  public static get SCALE_FACTOR() {
    return 0.5
  }

  public static get SHIP_FRAME_WIDTH() {
    return 37
  }

  public static get SHIP_FRAME_HEIGHT() {
    return 64
  }

  public static get GAME_WINDOW_WIDTH() {
    return 640
  }

  public static get GAME_WINDOW_HEIGHT() {
    return 640
  }

  public static get GAME_WINDOW_WIDTH_TILES() {
    return Constants.GAME_WINDOW_WIDTH / (Constants.TILE_SIZE * Constants.SCALE_FACTOR)
  }

  public static get GAME_WINDOW_HEIGHT_TILES() {
    return Constants.GAME_WINDOW_HEIGHT / (Constants.TILE_SIZE * Constants.SCALE_FACTOR)
  }

  public static get CONTEXT_MENU_WIDTH() {
    return MapUtils.tileToPixelValue(3)
  }

  public static get CONTEXT_MENU_HEIGHT() {
    return MapUtils.tileToPixelValue(1)
  }

  public static get CONTEXT_MENU_OFFSET_X() {
    return MapUtils.tileToPixelValue(1)
  }

  public static GET_TILE_TYPE(tileIndex: number) {
    switch (tileIndex) {
      case 73: {
        return 'Ocean'
      }
      default:
        return 'Island'
    }
  }
}
