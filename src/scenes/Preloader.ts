import Phaser from 'phaser'
import { Ship } from './Ship'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('tiles', 'tiles/ocean_tiles.png')
        this.load.tilemapTiledJSON('ocean', 'tiles/ocean.json')
        this.load.spritesheet('ship', 'ships/ships.png', {
            frameHeight: Ship.SPRITE_FRAME_HEIGHT,
            frameWidth: Ship.SPRITE_FRAME_WIDTH,
            startFrame: 0,
            endFrame: 5
        })
    }

    create() {
        this.scene.start('game')
    }
}