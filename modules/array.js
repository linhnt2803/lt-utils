
function arUnique(arr = [], comparator = (v1, v2) => (v1 === v2)) {
  return arr.filter((value, index, srcArray) => index == srcArray.findIndex(v => comparator(value, v)))
}

function arChunk(arr, n = 1) {
  return arr.slice(0, (arr.length + n - 1) / n | 0)
      .map((v, i) => arr.slice(n * i, n * i + n))
}

Object.defineProperty(Array.prototype, 'arUnique', {
  value: function(comparator = (v1, v2) => (v1 === v2)) {
    return arUnique(this, comparator)
  }
})

Object.defineProperty(Array.prototype, 'arChunk', {
  value: function(n = 1) {
    return arChunk(this, n)
  }
})

module.exports = {
  arUnique,
  arChunk
}