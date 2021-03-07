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
  }

  public setPosition(posX: number, posY: number) {
    this.sprite.setX(MapUtils.getPixelCoords(posX))
    this.sprite.setY(MapUtils.getPixelCoords(posY))
  }

  animatePath(path: any[] | undefined, index: number): void {
    if (!path) {
      return
    }
    if (index === path.length) {
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
        this.animatePath(path, index + 1)
      },
    })
  }

  public move(x: number, y: number) {
    const path = PathUtils.findShortestPath(
      { x: this.currX, y: this.currY },
      { x, y },
      this.gameScene.level
    )
    this.animatePath(path, 0)
  }
}
