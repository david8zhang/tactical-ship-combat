import Phaser from 'phaser'
import { Cursor } from '../map/Cursor'
import { Level } from '../level/level'
import { Ship, ShipConfig, ShipType } from '../level/Ship'
import { Camera } from '../map/Camera'
import { ActionMenu } from '../ui/ActionMenu'
import { AI } from '../level/AI'

const PLAYER_SHIPS = [
  {
    side: 'Player',
    shipType: ShipType.Pirate,
    name: 'The Black Pearl',
    defaultPosition: {
      x: 0,
      y: 0,
    },
    moveRange: 10,
  },
  {
    side: 'Player',
    shipType: ShipType.Pirate,
    name: "Queen Anne's Revenge",
    defaultPosition: {
      x: 1,
      y: 0,
    },
    moveRange: 10,
  },
  {
    side: 'Player',
    shipType: ShipType.Pirate,
    name: 'Whydah Galley',
    defaultPosition: {
      x: 1,
      y: 1,
    },
    moveRange: 10,
  },
]

const ENEMY_SHIPS = [
  {
    side: 'Enemy',
    shipType: ShipType.Red,
    name: 'HMS Nemesis',
    defaultPosition: {
      x: 19,
      y: 19,
    },
    moveRange: 10,
  },
  {
    side: 'Enemy',
    shipType: ShipType.Red,
    name: 'The Dragon',
    defaultPosition: {
      x: 18,
      y: 19,
    },
    moveRange: 10,
  },
  {
    side: 'Enemy',
    shipType: ShipType.Red,
    name: 'HMS Salisbury',
    defaultPosition: {
      x: 19,
      y: 18,
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
    this.ai = new AI(this, { enemyShips: ENEMY_SHIPS })
  }

  create() {
    this.setupLevel()
    this.camera = new Camera(this.cameras.main)
    this.mapCursor = new Cursor(this, 0, 0)

    // Add Player ships
    const playerShips: Ship[] = PLAYER_SHIPS.map((config: ShipConfig) => new Ship(this, config))
    const enemyShips: Ship[] = ENEMY_SHIPS.map((config: ShipConfig) => new Ship(this, config))
    this.level.addPlayerShips(playerShips)
    this.level.addEnemyShips(enemyShips)

    // Create an action menu
    this.actionMenu = new ActionMenu(this)
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
