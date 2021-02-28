import { Constants } from '~/utils/Constants'

export class Level {
  private map: number[][]
  private mapObject: number[][]
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.map = []
    this.mapObject = []
    this.scene = scene
  }

  initMap() {
    const map = this.scene.make.tilemap({
      key: 'ocean',
      tileHeight: 64,
      tileWidth: 64,
    })
    map.addTilesetImage('ocean_tiles', 'tiles')
    for (let i = 0; i < map.layers.length; i++) {
      const layer = map.createLayer(map.layers[i].name, 'ocean_tiles', 0, 0)
      layer.setDepth(i)
      layer.scale = Constants.SCALE_FACTOR
    }
    return map
  }
}
