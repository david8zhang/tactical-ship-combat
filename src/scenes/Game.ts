import Phaser from 'phaser'
import { Cursor } from '../map/Cursor'
import { Level } from '../level/level'
import { Ship, ShipConfig, ShipType } from '../level/Ship'
import { Camera } from '../map/Camera'
import { MapUtils } from '../utils/MapUtils'
import { Constants } from '../utils/Constants'
import Menu from '../ui/Menu'

const PLAYER_SHIPS = [
  {
    shipType: ShipType.Pirate,
    name: 'The Black Pearl',
    defaultPosition: {
      x: 0,
      y: 0,
    },
    moveRange: 4,
  },
  {
    shipType: ShipType.Pirate,
    name: "Queen Anne's Revenge",
    defaultPosition: {
      x: 1,
      y: 0,
    },
    moveRange: 4,
  },
  {
    shipType: ShipType.Pirate,
    name: 'Whydah Galley',
    defaultPosition: {
      x: 1,
      y: 1,
    },
    moveRange: 4,
  },
]

export default class Game extends Phaser.Scene {
  public level!: Level
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public mapCursor!: Cursor
  public map!: Phaser.Tilemaps.Tilemap
  public camera!: Camera
  public menu!: Menu

  constructor() {
    super('game')
  }

  preload() {
    this.level = new Level(this)
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    this.setupLevel()
    this.camera = new Camera(this.cameras.main)
    this.mapCursor = new Cursor(this, 0, 0)

    // Add Player ships
    const playerShips: Ship[] = PLAYER_SHIPS.map((config: ShipConfig) => new Ship(this, config))
    this.level.addShips(playerShips)
  }

  setupLevel() {
    this.map = this.level.initMap()
  }

  update() {
    this.mapCursor.update(this.cursors)
  }
}
