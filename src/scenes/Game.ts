import Phaser from 'phaser'
import { Level } from '../level/level'
import { Constants } from '../utils/Constants'
import { Ship } from './Ship'

export default class Game extends Phaser.Scene {
  private level!: Level
  private controls!: Phaser.Cameras.Controls.FixedKeyControl
  private map!: Phaser.Tilemaps.Tilemap

  constructor() {
    super('game')
  }

  preload() {
    this.level = new Level(this)
  }

  create() {
    this.setupLevel()
    this.configureCamera()

    const ship = new Ship(this, 0, 0)
  }

  setupLevel() {
    this.map = this.level.initMap()
  }

  configureCamera() {
    const camera = this.cameras.main
    const cursors = this.input.keyboard.createCursorKeys()
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: camera,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    })

    camera.setBounds(
      0,
      0,
      this.map.widthInPixels * Constants.SCALE_FACTOR,
      this.map.heightInPixels * Constants.SCALE_FACTOR
    )
  }

  update(time, delta) {
    this.controls.update(delta)
  }
}
