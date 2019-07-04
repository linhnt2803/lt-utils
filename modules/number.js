/**
 * make sure number between min and max (min <= number <= max)
 */
function nuClamp(number, min, max) {
  number = parseFloat(number) || 0
  return number < min ? min : number > max ? max : number
}

Object.defineProperty(Number.prototype, 'nuClamp', {
  value: function(min, max) {
    return nuClamp(this, min, max)
  }
})

module.exports = {
  nuClamp
}