import Phaser from 'phaser'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 640,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0}
		}
	},
	scene: [Preloader, Game]
}

export default new Phaser.Game(config)
