import Phaser from 'phaser'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('tiles', 'tiles/ocean_tiles.png')
        this.load.tilemapTiledJSON('ocean', 'tiles/ocean.json')
    }

    create() {
        this.scene.start('game')
    }
}