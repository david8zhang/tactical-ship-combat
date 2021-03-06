import Phaser from 'phaser'
import { Constants } from '../utils/Constants'
import { Ship } from '../level/Ship'

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }

  preload() {
    this.load.image('cursor', 'cursor.png')
    this.load.tilemapTiledJSON('ocean', 'tiles/ocean.json')
    this.load.image('tiles', 'tiles/ocean_tiles.png')
    this.load.image('panel', 'ui/grey_panel.png')
    this.load.spritesheet('ship', 'ships/ships.png', {
      frameHeight: Constants.SHIP_FRAME_HEIGHT,
      frameWidth: Constants.SHIP_FRAME_WIDTH,
      startFrame: 0,
      endFrame: 5,
    })
  }

  create() {
    this.scene.start('game')
    this.scene.start('ui')
  }
}
