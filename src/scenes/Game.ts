import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
	constructor()
	{
		super('game')
	}

	preload()
    {
    }

    create()
    {
        const map = this.make.tilemap({ key: 'ocean' })
        const tileset = map.addTilesetImage('ocean_tiles', 'tiles')

        map.createLayer('Ocean', tileset)
        map.createLayer('Island', tileset)
    }
}
