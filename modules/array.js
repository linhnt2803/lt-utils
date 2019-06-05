
function unique(arr = [], comparator = (v1, v2) => (v1 === v2)) {
  return arr.filter((value, index, srcArray) => index == srcArray.findIndex(v => comparator(value, v)))
}

function chunk(arr, n = 1) {
  return arr.slice(0, (arr.length + n - 1) / n | 0)
      .map((v, i) => arr.slice(n * i, n * i + n))
}

Object.defineProperty(Array.prototype, 'unique', {
  value: function(comparator = (v1, v2) => (v1 === v2)) {
    return unique(this, comparator)
  }
})

Object.defineProperty(Array.prototype, 'chunk', {
  value: function(n = 1) {
    return chunk(this, n)
  }
})

module.exports = {
  unique,
  chunk
}