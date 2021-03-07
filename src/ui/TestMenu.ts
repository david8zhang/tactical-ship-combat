export default class TestMenu {
  private container!: Phaser.GameObjects.Container
  private panelWidth: number = 400
  private panelHeight: number = 150

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale
    this.container = scene.add.container(
      width / 2 - this.panelWidth / 2,
      height / 2 - this.panelHeight / 2
    )
    this.container.setDepth(1000)
    const panel = scene.add.nineslice(0, 0, this.panelWidth, this.panelHeight, 'panel', 24)
    const text = scene.add
      .text(panel.width / 2, panel.height / 2, 'Hello', {
        color: 'black',
        fontSize: '28px',
      })
      .setOrigin(0.5, 0.5)
    this.container.add(panel)
    this.container.add(text)
    this.container.setVisible(true)
  }
}
