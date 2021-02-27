import Phaser from 'phaser'
import { Ship } from './Ship';

export default class Game extends Phaser.Scene
{
    public static readonly TILE_SIZE = 64;
	constructor()
	{
		super('game')
	}

    create()
    {
        const map = this.make.tilemap({ key: 'ocean', tileHeight: 64, tileWidth: 64 })
        map.addTilesetImage('ocean_tiles', 'tiles')
        for (let i = 0; i < map.layers.length; i++) {
            const layer = map.createLayer(map.layers[i].name, 'ocean_tiles', 0, 0)
            layer.setDepth(i);
            layer.scale = 0.5;
        }

        const shipSprite = this.physics.add.sprite(0, 0, 'ship');
        const ship = new Ship(shipSprite, 2, 2);
    }
}
