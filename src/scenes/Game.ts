import Phaser from 'phaser'
import { Cursor } from '~/map/Cursor'
import { Level } from '../level/level'
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
    const cursor = new Cursor(this, 0, 0)
    const ship = new Ship(this, 0, 0)
  }

  setupLevel() {
    this.map = this.level.initMap()
  }
}
