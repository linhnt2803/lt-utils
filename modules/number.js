/**
 * make sure number between min and max (min <= number <= max)
 */
function clamp(number, min, max) {
  number = parseFloat(number) || 0
  return number < min ? min : number > max ? max : number
}

Number.prototype.clamp = function(min, max) {
  return clamp(this, min, max)
}

module.exports = {
  clamp
}