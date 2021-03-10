import Game from '../scenes/Game'
import { PathUtils } from '~/utils/PathUtils'
import { Constants } from '../utils/Constants'
import { MapUtils } from '../utils/MapUtils'

export enum ShipType {
  'Red' = 0,
  'Blue' = 1,
  'White' = 2,
  'Green' = 3,
  'Pirate' = 4,
  'Yellow' = 5,
}

export interface ShipConfig {
  name: string
  shipType: ShipType
  defaultPosition: {
    x: number
    y: number
  }
  moveRange: number
}

export class Ship {
  public name: string
  public currX: number
  public currY: number
  public moveRange: number
  public hasMoved: boolean
  private gameScene: Game
  private sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody

  constructor(scene: Game, shipConfig: ShipConfig) {
    this.name = shipConfig.name
    this.sprite = scene.physics.add.sprite(0, 0, 'ship', shipConfig.shipType || 0)
    this.gameScene = scene
    this.currX = shipConfig.defaultPosition.x
    this.currY = shipConfig.defaultPosition.y
    this.moveRange = shipConfig.moveRange
    this.sprite.setDepth(2)
    this.sprite.scale = Constants.SCALE_FACTOR
    this.setPosition(shipConfig.defaultPosition.x, shipConfig.defaultPosition.y)
    this.hasMoved = false
  }

  public setPosition(posX: number, posY: number) {
    this.sprite.setX(MapUtils.getPixelCoords(posX))
    this.sprite.setY(MapUtils.getPixelCoords(posY))
  }

  public setHasMoved(hasMoved: boolean) {
    // If has moved, grey out the ship
    if (hasMoved) {
      this.sprite.setTint(0x000000)
      this.sprite.setAlpha(0.5)
    } else {
      this.sprite.setTint(0xffffff)
      this.sprite.setAlpha(1)
    }
    this.hasMoved = hasMoved
  }

  animatePath(path: any[] | undefined, index: number, cb: Function): void {
    if (!path) {
      return
    }
    if (index === path.length) {
      cb()
      return
    }
    const step = path[index]
    const xDiff = (step.x - this.currX) * (Constants.TILE_SIZE * Constants.SCALE_FACTOR)
    const yDiff = (step.y - this.currY) * (Constants.TILE_SIZE * Constants.SCALE_FACTOR)
    this.gameScene.tweens.add({
      targets: this.sprite,
      duration: 75,
      x: `+=${xDiff}`,
      y: `+=${yDiff}`,
      onComplete: () => {
        this.sprite.setX(MapUtils.getPixelCoords(step.x))
        this.sprite.setY(MapUtils.getPixelCoords(step.y))
        this.currX = step.x
        this.currY = step.y
        this.animatePath(path, index + 1, cb)
      },
    })
  }

  public move(x: number, y: number, cb: Function) {
    const path = PathUtils.findShortestPath(
      { x: this.currX, y: this.currY },
      { x, y },
      this.gameScene.level
    )
    this.animatePath(path, 0, cb)
  }
}
