import { UnitPreview } from '~/ui/UnitPreview'

export default class UIScene extends Phaser.Scene {
  private static instance: UIScene
  public unitPreview!: UnitPreview
  constructor() {
    super('ui')
    UIScene.instance = this
  }

  create() {
    this.unitPreview = new UnitPreview(this)
  }

  public static getInstance() {
    return UIScene.instance
  }
}
