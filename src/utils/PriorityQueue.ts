class PQElement {
  public element: any
  public priority: number
  constructor(element, priority) {
    this.element = element
    this.priority = priority
  }
}

export class PriorityQueue {
  private items: any[] = []
  constructor() {
    this.items = []
  }

  /**
   * Insert an element
   * @param  {object} element
   * @param  {int|float} priority
   * @return {}
   */
  enqueue(element: any, priority: number): void {
    var newEle = new PQElement(element, priority)
    var contain = false
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > newEle.priority) {
        this.items.splice(i, 0, newEle)
        contain = true
        break
      }
    }

    if (!contain) {
      this.items.push(newEle)
    }
  }

  /**
   * Remove the front element, highest priority
   * @return {PQElement}
   */
  dequeue(): PQElement | null {
    if (this.isEmpty()) return null
    return this.items.shift()
  }

  /**
   * Return the front element, highest priority
   * @return {PQElement}
   */
  front() {
    if (this.isEmpty()) return null
    return this.items[0]
  }

  /**
   * Return the rear element, lowest priority
   * @return {PQElement}
   */
  rear() {
    if (this.isEmpty()) return 'No elements in Queue'
    return this.items[this.items.length - 1]
  }

  isEmpty() {
    return this.items.length == 0
  }
}
