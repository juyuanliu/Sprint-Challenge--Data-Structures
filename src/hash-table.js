/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const { LimitedArray, getIndexBelowMax, LinkedList } = require('./hash-table-helpers');

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
  }

  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    const keyVals = [];
    for (let i = 0; i < oldStorage.length; i++) {
      if (oldStorage.storage[i] !== undefined) {
        let currentNode = oldStorage.storage[i].head;
        while (currentNode !== null) {
          keyVals.push([currentNode.value[0], currentNode.value[1]]);
          currentNode = currentNode.next;
        }
      }
    }
    for (let j = 0; j < keyVals.length; j++) {
      this.insert(keyVals[j][0], keyVals[j][1]);
    }
  }

  capacityIsFull() {
    let fullCells = 0;
    this.storage.each((bucket) => {
      if (bucket !== undefined) fullCells++;
    });
    return fullCells / this.limit >= 0.75;
  }

  insert(key, value) {
    if (this.capacityIsFull()) this.resize();
    const index = getIndexBelowMax(key.toString(), this.limit);
    if (!this.storage.get(index)) {
      const bucket = new LinkedList();
      bucket.addToTail([key, value]);
      this.storage.set(index, bucket);
    }
    if (this.storage.get(index)) {
      const bucket = this.storage.get(index);
      let keyFound = false;
      let currentNode = bucket.head;
      while ((currentNode.next !== null) && (!keyFound)) {
        if (currentNode.value[0] === key) {
          currentNode.value[1] = value;
          keyFound = true;
        }
        currentNode = currentNode.next;
      }
      if (!keyFound) {
        bucket.addToTail([key, value]);
      }
    }
  }

  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket) {
      let found = false;
      if (bucket.head.value[0] === key) {
        bucket.removeHead();
        found = true;
      }
      let previousNode = bucket.head;
      let currentNode = previousNode.next;
      while ((currentNode !== null) && (!found)) {
        if (currentNode.value[0] === key) {
          previousNode.next = currentNode.next;
          currentNode.next = null;
          found = true;
          if (bucket.tail === currentNode) {
            bucket.tail = previousNode;
          }
        }
        if (!found) {
          previousNode = currentNode;
          currentNode = currentNode.next;
        }
      }
    }
  }

  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    if (bucket) {
      let scannedNode = bucket.head;
      let found = false;
      while (scannedNode.next !== null) {
        if (scannedNode.value[0] === key) {
          found = true;
          return scannedNode.value[1];
        }
        scannedNode = scannedNode.next;
      }
      if (!found) {
        return undefined;
      }
    }
  }
}

module.exports = HashTable;
