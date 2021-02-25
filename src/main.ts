import Phaser from 'phaser'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 2400,
	height: 1800,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0}
		}
	},
	scene: [Preloader, Game],
	scale: {
		zoom: 0.5
	}
}

export default new Phaser.Game(config)
