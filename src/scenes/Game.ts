import Phaser from 'phaser'
import { Cursor } from '../map/Cursor'
import { Level } from '../level/level'
import { Ship, ShipConfig, ShipType } from '../level/Ship'
import { Camera } from '../map/Camera'
import { Map } from '../map/Map'
import { Constants } from '../utils/Constants'

const PLAYER_SHIPS = [
  {
    shipType: ShipType.Pirate,
    name: 'The Black Pearl',
    defaultPosition: {
      x: 0,
      y: 0,
    },
  },
  {
    shipType: ShipType.Pirate,
    name: "Queen Anne's Revenge",
    defaultPosition: {
      x: 1,
      y: 0,
    },
  },
  {
    shipType: ShipType.Pirate,
    name: 'Whydah Galley',
    defaultPosition: {
      x: 1,
      y: 1,
    },
  },
]

export default class Game extends Phaser.Scene {
  public level!: Level
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public mapCursor!: Cursor
  public map!: Phaser.Tilemaps.Tilemap
  public camera!: Camera

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

    // Add a highlight tile
    let tile = this.add.text(Map.tileToPixelValue(10), Map.tileToPixelValue(10), '', {
      backgroundColor: '#4287F580',
    })
    tile.setFixedSize(Constants.SCALED_TILE_SIZE, Constants.SCALED_TILE_SIZE)
  }

  setupLevel() {
    this.map = this.level.initMap()
  }

  update() {
    this.mapCursor.update(this.cursors)
  }
}
