import Phaser from 'phaser'
import { Cursor } from '../map/Cursor'
import { Level } from '../level/level'
import { Ship, ShipConfig, ShipType } from '../level/Ship'
import { Camera } from '../map/Camera'
import { ActionMenu } from '../ui/ActionMenu'
import { AI } from '../level/AI'

const PLAYER_SHIPS = [
  {
    shipType: ShipType.Pirate,
    name: 'The Black Pearl',
    defaultPosition: {
      x: 0,
      y: 0,
    },
    moveRange: 10,
  },
  {
    shipType: ShipType.Pirate,
    name: "Queen Anne's Revenge",
    defaultPosition: {
      x: 1,
      y: 0,
    },
    moveRange: 10,
  },
  {
    shipType: ShipType.Pirate,
    name: 'Whydah Galley',
    defaultPosition: {
      x: 1,
      y: 1,
    },
    moveRange: 10,
  },
]

export default class Game extends Phaser.Scene {
  public level!: Level
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public mapCursor!: Cursor
  public map!: Phaser.Tilemaps.Tilemap
  public camera!: Camera
  public actionMenu!: ActionMenu
  public ai!: AI

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

    // Create an action menu
    this.actionMenu = new ActionMenu(this)
    this.actionMenu.positionMenu({ x: 0, y: 0 })

    // Initialize an AI that controls all the enemy ships
    this.ai = new AI()
  }

  setupLevel() {
    this.map = this.level.initMap()
  }

  update() {
    if (!this.actionMenu.isEnabled) {
      this.mapCursor.update(this.cursors)
    } else {
      this.actionMenu.update(this.cursors)
    }
  }
}
