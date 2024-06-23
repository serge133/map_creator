export class PriorityQueue {
    constructor() {
      this.collection = [];
    }
  
    enqueue(element) {
      if (this.isEmpty()) {
        this.collection.push(element);
      } else {
        let added = false;
        for (let i = 0; i < this.collection.length; i++) {
          if (element[1] < this.collection[i][1]) { // Checking the priority
            this.collection.splice(i, 0, element);
            added = true;
            break;
          }
        }
        if (!added) {
          this.collection.push(element);
        }
      }
    }
  
    dequeue() {
      return this.collection.shift();
    }
  
    isEmpty() {
      return this.collection.length === 0;
    }
}

export function calc_euclidian_distance(x1, y1, x2, y2) {
  const width = x2 - x1;
  const height = y2 - y1;

  return Math.sqrt(width**2 + height**2);
}