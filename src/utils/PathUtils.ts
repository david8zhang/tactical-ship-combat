import { Level } from '../level/level'
import { Constants } from './Constants'
import { PriorityQueue } from './PriorityQueue'

export class PathUtils {
  static getSquaresInRange(range: number, startX: number, startY: number) {
    const seen = new Set<string>([])
    let currLevel = range
    const directions = [
      [0, 1],
      [0, -1],
      [-1, 0],
      [1, 0],
    ]
    const queue = [[startX, startY]]
    seen.add(`${startX},${startY}`)
    const squaresInRange: number[][] = []
    while (queue.length > 0) {
      const size = queue.length
      if (currLevel == 0) {
        return squaresInRange
      }
      for (let i = 0; i < size; i++) {
        const coord = queue.shift() as number[]
        squaresInRange.push(coord)
        directions.forEach((dir) => {
          const newCoords = [coord[0] + dir[0], coord[1] + dir[1]]
          if (!seen.has(`${newCoords[0]},${newCoords[1]}`)) {
            seen.add(`${newCoords[0]},${newCoords[1]}`)
            queue.push(newCoords)
          }
        })
      }
      currLevel--
    }
    return squaresInRange
  }

  /**
   * find shortest path between 2 point using Best First Search
   * @param  {array} map
   * @param  {object} start
   * @param  {object} end
   * @return {array} travel path
   */
  static findShortestPath(
    start: { x: number; y: number },
    end: { x: number; y: number },
    level: Level
  ) {
    var queue = new PriorityQueue()
    queue.enqueue(
      {
        x: start.x,
        y: start.y,
        parent: null,
      },
      0
    )

    const directions = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ]

    // 2d array to store visited position
    const visited = new Set<string>([`${start.y},${start.x}`])

    while (!queue.isEmpty()) {
      // Get current position
      let currentPos = queue.dequeue()!.element

      // Explore surrounding
      for (let i = 0; i < directions.length; i++) {
        const dir = directions[i]
        let newPos = {
          x: currentPos.x + dir[0],
          y: currentPos.y + dir[1],
          parent: null,
        }
        if (newPos.x == end.x && newPos.y == end.y) {
          // Found end position, get full path from start to end
          newPos.parent = currentPos
          return this.traceback(newPos)
        }
        // if current position is movable
        if (
          !visited.has(`${newPos.y},${newPos.x}`) &&
          level.isTileInBounds(newPos.x, newPos.y) &&
          !level.isObjectAtSpace(newPos.x, newPos.y)
        ) {
          // and haven't visited
          // Calculate distance to goal
          let d = Math.sqrt(Math.pow(end.x - newPos.x, 2) + Math.pow(end.y - newPos.y, 2))
          queue.enqueue(
            {
              x: newPos.x,
              y: newPos.y,
              parent: currentPos,
            },
            d
          )
          visited.add(`${newPos.y},${newPos.x}`)
        }
      }
    }
  }

  static manhattanDistance(start: { x: number; y: number }, end: { x: number; y: number }) {
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y)
  }

  static pythagoreanDistance(start: { x: number; y: number }, end: { x: number; y: number }) {
    const xDiff = end.x - start.x
    const yDiff = end.y - start.y
    return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
  }

  /**
   * Trace back to starting position
   * @param  {object} end destination
   * @return {array} array from destination back to start
   */
  static traceback(end) {
    let path = [end]
    do {
      path.push(path[path.length - 1].parent)
    } while (path[path.length - 1].parent)
    path.reverse()
    return path
  }
}
