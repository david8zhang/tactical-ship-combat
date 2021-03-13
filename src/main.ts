import Phaser from 'phaser'
import { Plugin as NineSlicePlugin } from 'phaser3-nineslice'

import Game from './scenes/Game'
import Preloader from './scenes/Preloader'
import UIScene from './scenes/UIScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 640,
  height: 640,
  backgroundColor: '#0984e3',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  plugins: {
    global: [NineSlicePlugin.DefaultCfg],
  },
  scene: [Preloader, Game, UIScene],
}

export default new Phaser.Game(config)
