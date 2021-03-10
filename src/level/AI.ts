export class AI {
  moveEnemies(cb: Function) {
    console.log('Doing enemy turn...')
    setTimeout(() => {
      cb()
    }, 2000)
  }
}
